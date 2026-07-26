<template>
  <div class="fixed inset-0 bg-neutral-900/50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
    <div class="bg-[#fcfcfc] rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl p-4 sm:p-6 my-auto max-h-[95vh] overflow-y-auto">

      <!-- TOP BAR -->
      <div class="flex items-center justify-between border-b border-neutral-200 pb-3 sm:pb-4 mb-4 sm:mb-6">
        <button
          type="button"
          @click="$emit('close')"
          class="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <h3 class="text-base sm:text-xl font-bold text-neutral-900">Create New Sale</h3>
      </div>

      <form @submit.prevent="handleSave" class="space-y-4 sm:space-y-6">

        <!-- 1. CUSTOMER IDENTIFICATION CARD -->
        <div class="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
          <h4 class="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Customer Identification
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="block text-xs font-medium text-neutral-600 mb-1">Customer Name *</label>
              <input
                v-model="form.customer_name"
                placeholder="Enter full name"
                required
                class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-neutral-600 mb-1">Phone Number *</label>
              <input
                v-model="form.phone_number"
                placeholder="Enter contact number"
                required
                class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-neutral-600 mb-1">Billing Address (Optional)</label>
            <textarea
              v-model="form.address"
              rows="2"
              placeholder="Enter billing address"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            ></textarea>
          </div>
        </div>

        <!-- 2. ITEMIZED INVOICE MANIFEST CARD -->
        <div class="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
          <h4 class="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Itemized Manifest
          </h4>

          <!-- Desktop/Tablet View -->
          <div class="hidden sm:block overflow-x-auto">
            <table class="w-full text-left text-sm text-neutral-700">
              <thead class="bg-neutral-50 text-neutral-500 uppercase text-xs">
                <tr>
                  <th scope="col" class="py-3 px-3 w-[35%]">Product / Description</th>
                  <th scope="col" class="py-3 px-3 w-[20%]">Category</th>
                  <th scope="col" class="py-3 px-3 w-[25%]">IMEI / Serial</th>
                  <th scope="col" class="py-3 px-3 w-[15%]">Price (₹)</th>
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
                      class="w-full px-2 py-1.5 border border-neutral-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-neutral-900"
                    >
                      <option value="phone">Phone</option>
                      <option value="fridge">Fridge</option>
                      <option value="washing_machine">Washing Machine</option>
                      <option value="other">Other</option>
                    </select>
                  </td>
                  <td class="py-2 px-3">
                    <input
                      v-model="item.imei_or_serial_no"
                      placeholder="IMEI / S/N"
                      class="w-full px-2.5 py-1.5 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-neutral-900"
                    />
                  </td>
                  <td class="py-2 px-3">
                    <input
                      v-model.number="item.price"
                      type="number"
                      min="0"
                      required
                      class="w-full px-2.5 py-1.5 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-neutral-900"
                    />
                  </td>
                  <td class="py-2 px-3 text-center">
                    <button
                      type="button"
                      @click="removeItemRow(index)"
                      class="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Remove Row"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
                  class="text-red-500 hover:text-red-700 p-1 flex items-center gap-1 text-xs font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-neutral-500 mb-1">Item Description *</label>
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
                    class="w-full px-2.5 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="phone">Phone</option>
                    <option value="fridge">Fridge</option>
                    <option value="washing_machine">Washing Machine</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-neutral-500 mb-1">Price (₹) *</label>
                  <input
                    v-model.number="item.price"
                    type="number"
                    min="0"
                    required
                    class="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-neutral-500 mb-1">IMEI or Serial Number</label>
                <input
                  v-model="item.imei_or_serial_no"
                  placeholder="Optional"
                  class="w-full px-3 py-2 bg-white border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="addItemRow"
            class="w-full py-2.5 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-600 text-xs sm:text-sm font-medium hover:border-neutral-400 hover:bg-neutral-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Another Row Item
          </button>
        </div>

        <!-- 3. FINANCIAL SUMMARY & ACTION CARD -->
        <div class="flex justify-end">
          <div class="w-full sm:w-96 bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 shadow-sm space-y-3">
            <div class="flex justify-between items-center text-sm font-semibold text-neutral-800">
              <span>Items Total Sum:</span>
              <span>₹{{ subtotal.toFixed(2) }}</span>
            </div>

            <div class="pt-1">
              <label class="block text-xs font-medium text-neutral-600 mb-1">Total Amount Paid Now (₹)</label>
              <input
                v-model.number="form.paid_amount"
                type="number"
                min="0"
                :max="subtotal"
                class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div v-if="form.paid_amount > 0" class="pt-1 transition-all">
              <label class="block text-xs font-medium text-neutral-600 mb-1">Payment Method</label>
              <select
                v-model="form.payment_method"
                class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900"
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
                <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span v-if="loading">Saving & Generating Bill...</span>
                <span v-else>Save Sale & View Invoice</span>
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const emit = defineEmits(['close', 'saved'])
const router = useRouter()

const loading = ref(false)

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
    price: 0
  }
])

const addItemRow = () => {
  items.value.push({
    id: Date.now() + Math.random(),
    item_name: '',
    item_category: 'phone',
    imei_or_serial_no: '',
    price: 0
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
  const hasInvalidItems = items.value.some(item => !item.item_name.trim() || item.price <= 0)
  if (hasInvalidItems) {
    alert("Please ensure all items have a description and a price greater than zero.")
    return
  }

  loading.value = true
  try {
    // 1. Insert or obtain customer record
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

    // 2. Prepare and insert sales rows
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

    // 3. Proportional payment distribution across item rows
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

    // 4. Redirect to the dedicated invoice view with auto-print triggered
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
