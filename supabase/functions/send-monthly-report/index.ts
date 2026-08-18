// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), { 
        status: 401, headers: { 'Content-Type': 'application/json' } 
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired JWT token" }), { 
        status: 401, headers: { 'Content-Type': 'application/json' } 
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { month, year } = await req.json();
    if (!month || !year) {
      return new Response(JSON.stringify({ error: "Missing required fields: month, year" }), { 
        status: 400, headers: { 'Content-Type': 'application/json' } 
      });
    }

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(Number(year), Number(month), 0).toISOString().split('T')[0];

    // Fetch sales data including sale id / invoice no and imei/serial no
    const { data: sales, error: salesError } = await supabaseAdmin
      .from('sales')
      .select(`
        id,
        item_name,
        item_category,
        imei_or_serial_no,
        price,
        paid_amount,
        remaining_amount,
        payment_status,
        sale_date,
        customers (
          name,
          phone_number
        )
      `)
      .gte('sale_date', startDate)
      .lte('sale_date', endDate)
      .eq('status', 'active')
      .order('sale_date', { ascending: true });

    if (salesError) throw salesError;

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((acc, curr) => acc + Number(curr.price), 0);
    const totalCollected = sales.reduce((acc, curr) => acc + Number(curr.paid_amount), 0);
    const totalPending = sales.reduce((acc, curr) => acc + Number(curr.remaining_amount), 0);

    // Build PDF
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const primaryColor = [23, 23, 23];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("SHAGUN ENTERPRISES AND COMMUNICATION", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Electronics, Appliances & Mobile Store | Ferusa Nahar Chowk, Chapra (Saran)", 14, 26);
    doc.text("GSTIN: 10DJTPK6228K1ZW | Contact: 9097625322", 14, 31);

    doc.setDrawColor(220, 220, 220);
    doc.line(14, 36, 196, 36);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(23, 23, 23);
    doc.text(`Monthly Financial Report — ${month}/${year}`, 14, 46);

    const cardY = 54;
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(14, cardY, 90, 22, 3, 3, 'F');
    doc.roundedRect(108, cardY, 90, 22, 3, 3, 'F');

    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text("TOTAL REVENUE", 20, cardY + 7);
    doc.text("TOTAL COLLECTED", 114, cardY + 7);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(23, 23, 23);
    doc.text(`Rs. ${totalRevenue.toLocaleString('en-IN')}`, 20, cardY + 16);
    doc.setTextColor(5, 150, 105);
    doc.text(`Rs. ${totalCollected.toLocaleString('en-IN')}`, 114, cardY + 16);

    const cardY2 = 80;
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(14, cardY2, 90, 22, 3, 3, 'F');
    doc.roundedRect(108, cardY2, 90, 22, 3, 3, 'F');

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(110, 110, 110);
    doc.text("PENDING DUES", 20, cardY2 + 7);
    doc.text("TOTAL TRANSACTIONS", 114, cardY2 + 7);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(217, 119, 6);
    doc.text(`Rs. ${totalPending.toLocaleString('en-IN')}`, 20, cardY2 + 16);
    doc.setTextColor(23, 23, 23);
    doc.text(`${totalSales} Sales`, 114, cardY2 + 16);

    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(23, 23, 23);
    doc.text("Detailed Sales Ledger", 14, 15);

    // Map table rows with Invoice ID and IMEI/Serial No instead of Phone and Status
    const tableRows = sales.map((s, index) => [
      index + 1,
      s.sale_date,
      `#${s.id}`, // Sale ID / Invoice No
      s.customers?.name || 'Walk-in',
      s.item_name,
      s.imei_or_serial_no || '-', // IMEI or Serial No
      `Rs. ${Number(s.price).toLocaleString('en-IN')}`,
      `Rs. ${Number(s.remaining_amount).toLocaleString('en-IN')}`
    ]);

    doc.autoTable({
      startY: 22,
      head: [['#', 'Date', 'Inv ID', 'Customer', 'Item Description', 'IMEI / Serial No', 'Price', 'Due']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [23, 23, 23], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [50, 50, 50] },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 20 },
        2: { cellWidth: 15 },
        3: { cellWidth: 32 },
        4: { cellWidth: 32 },
        5: { cellWidth: 32 },
        6: { cellWidth: 20, halign: 'right' },
        7: { cellWidth: 21, halign: 'right' },
      },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      }
    });

    const pdfOutput = doc.output('arraybuffer');

    return new Response(pdfOutput, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Shagun_Report_${month}_${year}.pdf"`,
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});