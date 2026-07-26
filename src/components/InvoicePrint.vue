<template>
  <div class="max-w-2xl mx-auto bg-white p-8 border border-neutral-200 rounded-2xl shadow-sm print:shadow-none print:border-none print:p-0">

    <!-- Action Bar (Hidden when printing) -->
    <div class="mb-6 flex justify-between items-center print:hidden border-b border-neutral-100 pb-4">
      <h2 class="text-lg font-bold text-neutral-800">Invoice Preview</h2>
      <button
        @click="printInvoice"
        class="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-all cursor-pointer"
      >
        <font-awesome-icon icon="fa-solid fa-print" />
        Print Invoice
      </button>
    </div>

    <!-- Printable Area -->
    <div id="printable-invoice" class="space-y-6">

      <!-- Store Header -->
      <div class="flex justify-between items-start border-b border-neutral-200 pb-6">
        <div>
          <h1 class="text-2xl font-black tracking-tight text-neutral-900 uppercase">Shagun Enterprises</h1>
          <p class="text-xs text-neutral-500 mt-1">Electronics, Appliances & Mobile Store</p>
          <p class="text-xs text-neutral-500">Main Road, Near Bus Stand, Bihar</p>
          <p class="text-xs text-neutral-500 font-mono mt-0.5">Contact: +91 98765 43210</p>
        </div>
        <div class="text-right">
          <span class="inline-block px-3 py-1 bg-neutral-100 text-neutral-800 font-bold text-xs rounded-md uppercase tracking-wider">
            Tax Invoice
          </span>
          <p class="text-xs font-mono text-neutral-400 mt-2">Inv #: {{ sale?.id ? sale.id.slice(0, 8).toUpperCase() : 'N/A' }}</p>
          <p class="text-xs text-neutral-600 mt-0.5">Date: {{ sale?.sale_date || new Date().toISOString().split('T')[0] }}</p>
        </div>
      </div>

      <!-- Customer Info & Verification QR -->
      <div class="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
        <div>
          <p class="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Customer Details</p>
          <p class="font-bold text-sm text-neutral-900 mt-1">{{ customer?.name || 'Valued Customer' }}</p>
          <p class="text-xs text-neutral-600 font-mono">{{ customer?.phone_number || 'N/A' }}</p>
          <p class="text-xs text-neutral-500 mt-0.5">{{ customer?.address || 'N/A' }}</p>
        </div>

        <!-- Verification QR Code -->
        <div class="flex flex-col items-end justify-center">
          <canvas ref="qrCanvas" class="w-20 h-20 border border-neutral-200 rounded-lg p-1 bg-white"></canvas>
          <p class="text-[9px] font-semibold text-neutral-400 mt-1 tracking-tight">Scan to Verify Bill</p>
        </div>
      </div>

      <!-- Item Details Table -->
      <table class="w-full text-left text-sm border-collapse">
        <thead>
          <tr class="border-b border-neutral-200 text-xs font-bold uppercase text-neutral-500 bg-neutral-50">
            <th class="py-2.5 px-3">Item Description</th>
            <th class="py-2.5 px-3">Category</th>
            <th class="py-2.5 px-3">IMEI / Serial</th>
            <th class="py-2.5 px-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-if="sale">
            <td class="py-3 px-3 font-semibold text-neutral-900">{{ sale?.item_name || 'Item' }}</td>
            <td class="py-3 px-3 text-xs capitalize text-neutral-500">{{ (sale?.item_category || 'other').replace('_', ' ') }}</td>
            <td class="py-3 px-3 text-xs font-mono text-neutral-600">{{ sale?.imei_or_serial_no || '-' }}</td>
            <td class="py-3 px-3 text-right font-bold text-neutral-900">₹{{ Number(sale?.price || 0).toLocaleString('en-IN') }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Payment Breakdown -->
      <div class="border-t border-neutral-200 pt-4 flex justify-end">
        <div class="w-64 space-y-2 text-sm">
          <div class="flex justify-between text-neutral-600">
            <span>Total Price:</span>
            <span class="font-semibold text-neutral-900">₹{{ Number(sale?.price || 0).toLocaleString('en-IN') }}</span>
          </div>
          <div class="flex justify-between text-emerald-600">
            <span>Amount Paid:</span>
            <span class="font-semibold">₹{{ Number(sale?.paid_amount || 0).toLocaleString('en-IN') }}</span>
          </div>
          <div class="flex justify-between text-neutral-900 font-bold border-t border-neutral-200 pt-2 text-base">
            <span>Remaining Due:</span>
            <span :class="(sale?.remaining_amount || 0) > 0 ? 'text-amber-600' : 'text-emerald-600'">
              ₹{{ Number(sale?.remaining_amount || 0).toLocaleString('en-IN') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Footer Terms -->
      <div class="border-t border-neutral-200 pt-4 text-[10px] text-neutral-400 text-center space-y-1">
        <p class="font-semibold text-neutral-500">Thank you for shopping with Shagun Enterprises!</p>
        <p>This is a computer-generated invoice and carries an authentic digital verification link via the QR code above.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  sale: { type: Object, required: true },
  customer: { type: Object, required: true },
  baseUrl: { type: String, default: 'http://localhost:5173' }
})

const qrCanvas = ref(null)

async function generateQRCode() {
  await nextTick()
  if (!props.sale?.id || !qrCanvas.value) return

  const verifyUrl = `${props.baseUrl}/verify-sale/${props.sale.id}`

  QRCode.toCanvas(
    qrCanvas.value,
    verifyUrl,
    {
      width: 100,
      margin: 1,
      color: {
        dark: '#171717',
        light: '#ffffff'
      }
    },
    (err) => {
      if (err) console.error('Error generating verification QR code:', err)
    }
  )
}

function printInvoice() {
  window.print()
}

onMounted(() => {
  generateQRCode()
})

watch(
  () => props.sale,
  () => {
    generateQRCode()
  },
  { deep: true }
)
</script>

<style>
@media print {
  @page {
    size: auto;
    margin: 10mm;
  }

  body * {
    visibility: hidden !important;
  }

  #printable-invoice,
  #printable-invoice * {
    visibility: visible !important;
  }

  #printable-invoice {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }
}
</style>
