<template>
  <div class="fixed inset-0 bg-neutral-900/50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
    <div class="bg-[#fcfcfc] rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl p-4 sm:p-6 my-auto max-h-[95vh] overflow-y-auto">

      <!-- TOP BAR -->
      <div class="flex items-center justify-between border-b border-neutral-200 pb-3 sm:pb-4 mb-4 sm:mb-6">
        <button
          type="button"
          @click="$emit('close')"
          class="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-left" class="text-xs" />
          Back
        </button>
        <h3 class="text-base sm:text-xl font-bold text-neutral-900 flex items-center gap-2">
          <font-awesome-icon icon="fa-solid fa-cart-plus" class="text-neutral-700" />
          Create New Sale
        </h3>
      </div>

      <form @submit.prevent="handleSave" class="space-y-4 sm:space-y-6">

        <!-- 1. CUSTOMER IDENTIFICATION CARD -->
        <div class="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
          <h4 class="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <font-awesome-icon icon="fa-solid fa-user-tag" />
            Customer Identification
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="block text-xs font-medium text-neutral-600 mb-1">
                Customer Name <span class="text-red-500 font-bold">*</span>
              </label>
              <input
                v-model="form.customer_name"
                placeholder="Enter full name"
                required
                class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-neutral-600 mb-1">
                Phone Number <span class="text-red-500 font-bold">*</span>
              </label>
              <input
                v-model="form.phone_number"
                type="tel"
                placeholder="Enter contact number"
                required
                class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-neutral-600 mb-1">
              Billing Address <span class="text-red-500 font-bold">*</span>
            </label>
            <textarea
              v-model="form.address"
              rows="2"
              placeholder="Enter billing address"
              required
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            ></textarea>
          </div>
        </div>

        <!-- 2. ITEMIZED INVOICE MANIFEST CARD -->
        <div class="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
          <h4 class="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <font-awesome-icon icon="fa-solid fa-boxes-stacked" />
            Itemized Manifest
          </h4>

          <!-- Desktop/Tablet View -->
          <div class="hidden sm:block overflow-x-auto">
            <table class="w-full text-left text-sm text-neutral-700">
              <thead class="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th scope="col" class="py-3 px-3 w-[30%]">
                    <span class="flex items-center gap-1">
                      Product Description <span class="text-red-500 font-bold">*</span>
                    </span>
                  </th>
                  <th scope="col" class="py-3 px-3 w-[20%]">Category</th>
                  <th scope="col" class="py-3 px-3 w-[30%]">
                    <span class="flex items-center gap-1">
                      IMEI / Serial <span class="text-red-500 font-bold">*</span>
                    </span>
                  </th>
                  <th scope="col" class="py-3 px-3 w-[15%]">
                    <span class="flex items-center gap-1">
                      Price (₹) <span class="text-red-500 font-bold">*</span>
                    </span>
                  </th>
                  <th scope="col" class="py-3 px-3 w-[5%]"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200">
                <tr v-for="(item, index) in items" :key="item.id">
                  <td class="py-2 px-3">
                    <input
                      v-model="item.item_name"
                      placeholder="Item description"
                      required
                      class="w-full px-2.5 py-1.5 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-neutral-900"
                    />
                  </td>
                  <td class="py-2 px-3">
                    <select
                      v-model="item.item_category"
                      class="w-full px-2 py-1.5 border border-neutral-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-neutral-900 cursor-pointer"
                    >
                      <option value="phone">Phone</option>
                      <option value="fridge">Fridge</option>
                      <option value="washing_machine">Washing Machine</option>
                      <option value="other">Other</option>
                    </select>
                  </td>
                  <td class="py-2 px-3">
                    <div class="flex items-center gap-1.5">
                      <input
                        v-model="item.imei_or_serial_no"
                        placeholder="IMEI / Serial No."
                        required
                        class="w-full px-2.5 py-1.5 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-neutral-900"
                      />
                      <!-- CAMERA SCAN BUTTON -->
                      <button
                        type="button"
                        @click="openScanner(index)"
                        title="Scan Barcode with Camera"
                        class="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md transition-colors flex-shrink-0 border border-neutral-300 cursor-pointer"
                      >
                        <font-awesome-icon icon="fa-solid fa-barcode" />
                      </button>
                    </div>
                  </td>
                  <td class="py-2 px-3">
                    <input
                      v-model.number="item.price"
                      type="number"
                      min="1"
                      required
                      placeholder="0"
                      class="w-full px-2.5 py-1.5 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-neutral-900"
                    />
                  </td>
                  <td class="py-2 px-3 text-center">
                    <button
                      type="button"
                      @click="removeItemRow(index)"
                      class="text-red-500 hover:text-red-700 p-1 transition-colors cursor-pointer"
                      title="Remove Row"
                    >
                      <font-awesome-icon icon="fa-solid fa-trash-can" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile View -->
          <div class="block sm:hidden space-y-3">
            <div
              v-for="(item, index) in items"
              :key="item.id"
              class="p-3 border border-neutral-200 rounded-lg bg-neutral-50/50 space-y-2.5 relative"
            >
              <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span class="text-xs font-bold text-neutral-500">Item #{{ index + 1 }}</span>
                <button
                  type="button"
                  @click="removeItemRow(index)"
                  class="text-red-500 hover:text-red-700 p-1 flex items-center gap-1 text-xs font-medium cursor-pointer"
                >
                  <font-awesome-icon icon="fa-solid fa-trash-can" />
                  Remove
                </button>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-neutral-500 mb-1">
                  Item Description <span class="text-red-500 font-bold">*</span>
                </label>
                <input
                  v-model="item.item_name"
                  placeholder="e.g. Samsung Galaxy M14"
                  required
                  class="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[11px] font-medium text-neutral-500 mb-1">Category</label>
                  <select
                    v-model="item.item_category"
                    class="w-full px-2.5 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-neutral-900 cursor-pointer"
                  >
                    <option value="phone">Phone</option>
                    <option value="fridge">Fridge</option>
                    <option value="washing_machine">Washing Machine</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-neutral-500 mb-1">
                    Price (₹) <span class="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    v-model.number="item.price"
                    type="number"
                    min="1"
                    required
                    class="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-neutral-500 mb-1">
                  IMEI or Serial Number <span class="text-red-500 font-bold">*</span>
                </label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="item.imei_or_serial_no"
                    placeholder="ENTER IMEI / SERIAL NO."
                    required
                    class="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-neutral-900"
                  />
                  <!-- MOBILE SCAN BUTTON -->
                  <button
                    type="button"
                    @click="openScanner(index)"
                    class="px-3 py-2 bg-neutral-900 text-white rounded-md text-xs font-medium flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                  >
                    <font-awesome-icon icon="fa-solid fa-camera" />
                    Scan
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="addItemRow"
            class="w-full py-2.5 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-600 text-xs sm:text-sm font-medium hover:border-neutral-400 hover:bg-neutral-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <font-awesome-icon icon="fa-solid fa-plus" />
            Add Another Row Item
          </button>
        </div>

        <!-- 3. FINANCIAL SUMMARY & ACTION CARD -->
        <div class="flex justify-end">
          <div class="w-full sm:w-96 bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 shadow-sm space-y-3">
            <div class="flex justify-between items-center text-sm font-semibold text-neutral-800">
              <span class="flex items-center gap-1.5">
                <font-awesome-icon icon="fa-solid fa-calculator" class="text-neutral-400" />
                Items Total Sum:
              </span>
              <span>₹{{ subtotal.toFixed(2) }}</span>
            </div>

            <div class="pt-1">
              <label class="block text-xs font-medium text-neutral-600 mb-1">
                Total Amount Paid Now (₹) <span class="text-red-500 font-bold">*</span>
              </label>
              <input
                v-model.number="form.paid_amount"
                type="number"
                min="0"
                :max="subtotal"
                required
                class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div v-if="form.paid_amount > 0" class="pt-1 transition-all">
              <label class="block text-xs font-medium text-neutral-600 mb-1">
                Payment Method <span class="text-red-500 font-bold">*</span>
              </label>
              <select
                v-model="form.payment_method"
                required
                class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 cursor-pointer"
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            <hr class="border-neutral-200 my-2" />

            <div class="flex justify-between items-center text-base sm:text-lg font-bold text-neutral-900">
              <span>Grand Total:</span>
              <span>₹{{ subtotal.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between items-center text-xs sm:text-sm font-semibold text-red-600">
              <span>Remaining Balance Due:</span>
              <span>₹{{ remainingBalance.toFixed(2) }}</span>
            </div>

            <div class="pt-3 space-y-2">
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <font-awesome-icon v-if="!loading" icon="fa-solid fa-file-invoice-dollar" />
                <font-awesome-icon v-else icon="fa-solid fa-spinner" class="animate-spin" />
                <span v-if="loading">Saving & Generating Bill...</span>
                <span v-else>Save Sale & View Invoice</span>
              </button>
            </div>
          </div>
        </div>

      </form>

      <!-- 4. BARCODE CAMERA SCANNER MODAL OVERLAY -->
      <div v-if="showScannerModal" class="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
        <div class="bg-white rounded-xl p-5 max-w-md w-full relative space-y-4 shadow-2xl">
          <div class="flex justify-between items-center border-b pb-2">
            <h4 class="font-bold text-neutral-800 text-sm sm:text-base flex items-center gap-2">
              <font-awesome-icon icon="fa-solid fa-camera" />
              Scan Barcode / IMEI
            </h4>
            <button @click="closeScanner" type="button" class="text-neutral-500 hover:text-black cursor-pointer">
              <font-awesome-icon icon="fa-solid fa-xmark" />
            </button>
          </div>

          <!-- Video viewport container required by html5-qrcode -->
          <div id="barcode-reader" class="w-full overflow-hidden rounded-lg bg-black min-h-[250px]"></div>

          <p class="text-xs text-neutral-500 text-center">
            Point camera at the barcode or serial number on the product box.
          </p>

          <button
            type="button"
            @click="closeScanner"
            class="w-full py-2 bg-neutral-200 text-neutral-800 font-medium rounded-lg text-sm hover:bg-neutral-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { Html5Qrcode } from 'html5-qrcode'

const emit = defineEmits(['close', 'saved'])
const router = useRouter()

const loading = ref(false)
const showScannerModal = ref(false)
const activeTargetIndex = ref(null)
let html5QrcodeScanner = null

const form = reactive({
  customer_name: '',
  phone_number: '',
  address: '',
  paid_amount: 0,
  payment_method: 'cash'
})

const items = ref([
  {
    id: Date.now(),
    item_name: '',
    item_category: 'phone',
    imei_or_serial_no: '',
    price: null
  }
])

// --- CAMERA SCANNER LOGIC ---
const openScanner = async (index) => {
  activeTargetIndex.value = index
  showScannerModal.value = true

  await nextTick()

  try {
    html5QrcodeScanner = new Html5Qrcode("barcode-reader")
    await html5QrcodeScanner.start(
      { facingMode: "environment" }, // Prefers rear camera on mobiles
      {
        fps: 10,
        qrbox: { width: 250, height: 150 } // Rectangular scanning zone for barcodes
      },
      (decodedText) => {
        // Successful barcode read
        if (activeTargetIndex.value !== null && items.value[activeTargetIndex.value]) {
          items.value[activeTargetIndex.value].imei_or_serial_no = decodedText
        }
        closeScanner()
      },
      () => {
        // Continuous frame search failure (ignored)
      }
    )
  } catch (err) {
    alert("Camera access failed or permission was denied: " + err)
    closeScanner()
  }
}

const closeScanner = async () => {
  if (html5QrcodeScanner) {
    try {
      await html5QrcodeScanner.stop()
      html5QrcodeScanner.clear()
    } catch (e) {
      // Ignored if camera was already stopping
    }
    html5QrcodeScanner = null
  }
  showScannerModal.value = false
  activeTargetIndex.value = null
}

onBeforeUnmount(() => {
  closeScanner()
})

const addItemRow = () => {
  items.value.push({
    id: Date.now() + Math.random(),
    item_name: '',
    item_category: 'phone',
    imei_or_serial_no: '',
    price: null
  })
}

const removeItemRow = (index) => {
  if (items.value.length === 1) {
    alert("An invoice must contain at least one product item.")
    return
  }
  items.value.splice(index, 1)
}

const subtotal = computed(() => {
  return items.value.reduce((sum, item) => sum + Number(item.price || 0), 0)
})

const remainingBalance = computed(() => Math.max(0, subtotal.value - (form.paid_amount || 0)))

async function handleSave() {
  // Enhanced validation guard
  if (!form.customer_name.trim() || !form.phone_number.trim() || !form.address.trim()) {
    alert("Please fill out all customer details.")
    return
  }

  const hasInvalidItems = items.value.some(
    item => !item.item_name.trim() || !item.imei_or_serial_no.trim() || !item.price || item.price <= 0
  )
  if (hasInvalidItems) {
    alert("Please ensure all items have a description, valid IMEI/Serial number, and a price greater than 0.")
    return
  }

  if (form.paid_amount === null || form.paid_amount < 0) {
    alert("Please enter a valid paid amount (0 or higher).")
    return
  }

  loading.value = true
  try {
    const { data: customer, error: custError } = await supabase
      .from('customers')
      .insert({
        name: form.customer_name,
        phone_number: form.phone_number,
        whatsapp_number: form.phone_number,
        address: form.address || null
      })
      .select()
      .single()

    if (custError) throw custError

    const salesPayload = items.value.map(item => ({
      customer_id: customer.id,
      item_name: item.item_name,
      item_category: item.item_category,
      imei_or_serial_no: item.imei_or_serial_no || null,
      price: Number(item.price)
    }))

    const { data: createdSales, error: saleError } = await supabase
      .from('sales')
      .insert(salesPayload)
      .select()

    if (saleError) throw saleError

    if (form.paid_amount > 0) {
      const totalItemPriceSum = subtotal.value || 1
      const paymentsPayload = []

      createdSales.forEach((sale, index) => {
        const originalItem = items.value[index]
        const itemProportion = originalItem.price / totalItemPriceSum
        const itemPaidAmount = Math.min(originalItem.price, form.paid_amount * itemProportion)

        if (itemPaidAmount > 0) {
          paymentsPayload.push({
            sale_id: sale.id,
            amount_paid: Number(itemPaidAmount.toFixed(2)),
            payment_method: form.payment_method,
            notes: 'Initial payment at POS'
          })
        }
      })

      if (paymentsPayload.length > 0) {
        const { error: paymentError } = await supabase
          .from('payments')
          .insert(paymentsPayload)

        if (paymentError) throw paymentError
      }
    }

    emit('saved')
    emit('close')

    const primarySaleId = createdSales[0].id
    router.push({
      name: 'verify-sale',
      params: { id: primarySaleId },
      query: { print: 'true' }
    })

  } catch (err) {
    if (err.code === '23505') {
      alert('Error: This IMEI/Serial number is already active in the system.')
    } else {
      alert('Database Error: ' + err.message)
    }
  } finally {
    loading.value = false
  }
}
</script>
