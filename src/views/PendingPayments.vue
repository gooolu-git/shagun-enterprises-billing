<template>
  <div class="min-h-screen bg-neutral-50/50 p-3 sm:p-6 lg:p-8 space-y-6">

    <!-- TOP HEADER & STATS BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl shrink-0">
          <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" />
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">Pending Dues & Credit Ledger</h1>
          <p class="text-xs text-neutral-500 mt-0.5">Track customers with remaining balances and manage payment collections</p>
        </div>
      </div>

      <!-- Quick Action Summary -->
      <div class="flex items-center gap-3 bg-amber-50 border border-amber-200/60 px-4 py-2.5 rounded-xl self-start sm:self-auto">
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" class="text-amber-600 text-sm" />
        <div>
          <p class="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Total Outstanding Dues</p>
          <p class="text-lg font-black text-amber-900">₹{{ totalPendingDues.toLocaleString('en-IN') }}</p>
        </div>
      </div>
    </div>

    <!-- CONTROLS: SEARCH & CATEGORY FILTER -->
    <div class="flex flex-col sm:flex-row items-center gap-3">
      <!-- Search Input -->
      <div class="relative w-full sm:flex-1">
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by customer name, phone, or item..."
          class="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 shadow-xs"
        />
      </div>

      <!-- Category Filter -->
      <div class="w-full sm:w-auto flex items-center gap-2">
        <select
          v-model="selectedCategory"
          class="w-full sm:w-48 px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 shadow-xs cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="phone">Phones</option>
          <option value="fridge">Fridges</option>
          <option value="washing_machine">Washing Machines</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="py-20 text-center space-y-3">
      <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-3xl text-neutral-400" />
      <p class="text-xs text-neutral-500 font-medium">Fetching pending payments...</p>
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="filteredLedger.length === 0" class="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-3 shadow-xs">
      <div class="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
        <font-awesome-icon icon="fa-solid fa-circle-check" />
      </div>
      <h3 class="text-base font-bold text-neutral-800">No Pending Dues Found</h3>
      <p class="text-xs text-neutral-500 max-w-sm mx-auto">
        {{ searchQuery ? 'No records match your search criteria.' : 'Great job! All customer accounts are fully settled.' }}
      </p>
    </div>

    <!-- LEDGER DATA -->
    <template v-else>

      <!-- DESKTOP / LAPTOP TABLE VIEW -->
      <div class="hidden md:block bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <table class="w-full text-left text-sm">
          <thead class="bg-neutral-50 border-b border-neutral-200 text-xs font-bold uppercase text-neutral-500">
            <tr>
              <th scope="col" class="py-3.5 px-4">Customer Info</th>
              <th scope="col" class="py-3.5 px-4">Purchased Item</th>
              <th scope="col" class="py-3.5 px-4">Date</th>
              <th scope="col" class="py-3.5 px-4 text-right">Price</th>
              <th scope="col" class="py-3.5 px-4 text-right">Paid</th>
              <th scope="col" class="py-3.5 px-4 text-right">Remaining Due</th>
              <th scope="col" class="py-3.5 px-4 text-center">Quick Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-for="item in filteredLedger" :key="item.id" class="hover:bg-neutral-50/80 transition-colors">
              <!-- Customer -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <!-- DiceBear Generated Avatar (v-html) -->
                  <div
                    v-html="getAvatarSvg(item.customers)"
                    class="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 [&>svg]:h-full [&>svg]:w-full shadow-2xs"
                  ></div>
                  <div>
                    <p class="font-bold text-neutral-900">{{ item.customers?.name || 'Unknown' }}</p>
                    <p class="text-xs text-neutral-500 font-mono">{{ item.customers?.phone_number || '-' }}</p>
                  </div>
                </div>
              </td>

              <!-- Product -->
              <td class="py-3.5 px-4">
                <p class="font-medium text-neutral-800">{{ item.item_name }}</p>
                <p class="text-[11px] text-neutral-400 font-mono" v-if="item.imei_or_serial_no">
                  IMEI: {{ item.imei_or_serial_no }}
                </p>
              </td>

              <!-- Date -->
              <td class="py-3.5 px-4 text-xs text-neutral-500">
                {{ formatDate(item.sale_date) }}
              </td>

              <!-- Price -->
              <td class="py-3.5 px-4 text-right font-semibold text-neutral-700">
                ₹{{ Number(item.price).toLocaleString('en-IN') }}
              </td>

              <!-- Paid -->
              <td class="py-3.5 px-4 text-right font-semibold text-emerald-600">
                ₹{{ Number(item.paid_amount).toLocaleString('en-IN') }}
              </td>

              <!-- Due -->
              <td class="py-3.5 px-4 text-right font-bold text-amber-600">
                ₹{{ Number(item.remaining_amount).toLocaleString('en-IN') }}
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4">
                <div class="flex items-center justify-center gap-2">
                  <!-- Direct Call Button -->
                  <a
                    :href="`tel:${item.customers?.phone_number}`"
                    class="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5"
                    title="Call Customer"
                  >
                    <font-awesome-icon icon="fa-solid fa-phone" />
                    <span>Call</span>
                  </a>

                  <!-- Record Payment Button -->
                  <button
                    @click="openPaymentModal(item)"
                    class="p-2 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <font-awesome-icon icon="fa-solid fa-receipt" />
                    <span>Collect</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- MOBILE CARD VIEW -->
      <div class="block md:hidden space-y-3">
        <div
          v-for="item in filteredLedger"
          :key="item.id"
          class="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs space-y-3"
        >
          <!-- Header: Avatar + Customer Info -->
          <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div class="flex items-center gap-2.5">
              <!-- DiceBear Generated Avatar (v-html) -->
              <div
                v-html="getAvatarSvg(item.customers)"
                class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 [&>svg]:h-full [&>svg]:w-full shadow-2xs"
              ></div>
              <div>
                <p class="font-bold text-neutral-900 text-sm">{{ item.customers?.name || 'Unknown' }}</p>
                <p class="text-xs text-neutral-500 font-mono">{{ item.customers?.phone_number || '-' }}</p>
              </div>
            </div>
            <span class="text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
              Pending
            </span>
          </div>

          <!-- Item Details -->
          <div class="text-xs space-y-1">
            <div class="flex justify-between">
              <span class="text-neutral-500">Item:</span>
              <span class="font-semibold text-neutral-800">{{ item.item_name }}</span>
            </div>
            <div class="flex justify-between" v-if="item.imei_or_serial_no">
              <span class="text-neutral-500">IMEI/Serial:</span>
              <span class="font-mono text-neutral-600">{{ item.imei_or_serial_no }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-500">Sale Date:</span>
              <span class="text-neutral-600">{{ formatDate(item.sale_date) }}</span>
            </div>
          </div>

          <!-- Financial Breakdown -->
          <div class="bg-neutral-50 p-2.5 rounded-xl text-xs space-y-1.5 border border-neutral-100">
            <div class="flex justify-between text-neutral-600">
              <span>Total Price:</span>
              <span class="font-semibold">₹{{ Number(item.price).toLocaleString('en-IN') }}</span>
            </div>
            <div class="flex justify-between text-emerald-600">
              <span>Paid So Far:</span>
              <span class="font-semibold">₹{{ Number(item.paid_amount).toLocaleString('en-IN') }}</span>
            </div>
            <div class="flex justify-between text-amber-700 font-bold border-t border-neutral-200 pt-1.5 text-sm">
              <span>Remaining Balance:</span>
              <span>₹{{ Number(item.remaining_amount).toLocaleString('en-IN') }}</span>
            </div>
          </div>

          <!-- Quick Actions Bar -->
          <div class="grid grid-cols-2 gap-2 pt-1">
            <a
              :href="`tel:${item.customers?.phone_number}`"
              class="w-full py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200 transition-colors"
            >
              <font-awesome-icon icon="fa-solid fa-phone" />
              Call Customer
            </a>
            <button
              @click="openPaymentModal(item)"
              class="w-full py-2 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" />
              Collect Money
            </button>
          </div>
        </div>
      </div>

    </template>

    <!-- RECORD PAYMENT MODAL -->
    <div v-if="activePaymentItem" class="fixed inset-0 bg-neutral-900/60 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl relative">
        <div class="flex justify-between items-center border-b border-neutral-100 pb-3">
          <h3 class="font-bold text-neutral-900 text-base flex items-center gap-2">
            <font-awesome-icon icon="fa-solid fa-cash-register" class="text-neutral-700" />
            Record Payment
          </h3>
          <button @click="activePaymentItem = null" class="text-neutral-400 hover:text-neutral-800 cursor-pointer">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <div class="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-xs space-y-1">
          <p><span class="text-neutral-500">Customer:</span> <strong class="text-neutral-800">{{ activePaymentItem.customers?.name }}</strong></p>
          <p><span class="text-neutral-500">Item:</span> <strong class="text-neutral-800">{{ activePaymentItem.item_name }}</strong></p>
          <p><span class="text-neutral-500">Remaining Balance:</span> <strong class="text-amber-600 font-bold">₹{{ activePaymentItem.remaining_amount }}</strong></p>
        </div>

        <form @submit.prevent="submitPayment" class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-neutral-600 mb-1">Payment Amount (₹) *</label>
            <input
              v-model.number="paymentForm.amount"
              type="number"
              min="1"
              :max="activePaymentItem.remaining_amount"
              required
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-neutral-600 mb-1">Payment Method</label>
            <select
              v-model="paymentForm.method"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900 cursor-pointer"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button
              type="button"
              @click="activePaymentItem = null"
              class="px-4 py-2 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submittingPayment"
              class="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <font-awesome-icon v-if="submittingPayment" icon="fa-solid fa-spinner" class="animate-spin" />
              <span>Save Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { Style, Avatar } from '@dicebear/core'
import avataaars from '@dicebear/styles/avataaars.json' with { type: 'json' }

const loading = ref(true)
const ledger = ref([])
const searchQuery = ref('')
const selectedCategory = ref('all')

const activePaymentItem = ref(null)
const submittingPayment = ref(false)
const paymentForm = ref({
  amount: 0,
  method: 'cash'
})

// Instantiate the style
const style = new Style(avataaars)

// Dynamic Avatar Generator matching Customer Profile logic
function getAvatarSvg(customer) {
  if (!customer) return ''

  const avatar = new Avatar(style, {
    seed: customer.phone_number || customer.name || 'Customer',
    topProbability: 100,
    topVariant: ['shortFlat', 'shortWaved', 'shortRound', 'shavedSides'],
    hairColor: ['2c1b18', '4a312c', '000000'],
    clothesVariant: ['blazerAndShirt', 'shirtCrewNeck', 'collarAndSweater'],
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc']
  })

  return avatar.toString()
}

// Fetch pending sales joined with customer details
async function fetchLedgerData() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        id,
        item_name,
        item_category,
        imei_or_serial_no,
        price,
        paid_amount,
        remaining_amount,
        sale_date,
        status,
        customers (
          name,
          phone_number,
          whatsapp_number
        )
      `)
      .eq('status', 'active')
      .gt('remaining_amount', 0)
      .order('sale_date', { ascending: false })

    if (error) throw error
    ledger.value = data || []
  } catch (err) {
    console.error('Error fetching credit ledger:', err.message)
  } finally {
    loading.value = false
  }
}

// Computed search & category filter
const filteredLedger = computed(() => {
  return ledger.value.filter(item => {
    const query = searchQuery.value.toLowerCase()
    const customerName = item.customers?.name?.toLowerCase() || ''
    const phone = item.customers?.phone_number || ''
    const itemName = item.item_name?.toLowerCase() || ''
    const imei = item.imei_or_serial_no?.toLowerCase() || ''

    const matchesSearch =
      customerName.includes(query) ||
      phone.includes(query) ||
      itemName.includes(query) ||
      imei.includes(query)

    const matchesCategory =
      selectedCategory.value === 'all' || item.item_category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

// Total calculation
const totalPendingDues = computed(() => {
  return ledger.value.reduce((sum, item) => sum + Number(item.remaining_amount || 0), 0)
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function openPaymentModal(item) {
  activePaymentItem.value = item
  paymentForm.value.amount = item.remaining_amount
  paymentForm.value.method = 'cash'
}

async function submitPayment() {
  if (!activePaymentItem.value) return
  submittingPayment.value = true

  try {
    const { error } = await supabase
      .from('payments')
      .insert({
        sale_id: activePaymentItem.value.id,
        amount_paid: Number(paymentForm.value.amount),
        payment_method: paymentForm.value.method,
        notes: 'Follow-up collection'
      })

    if (error) throw error

    activePaymentItem.value = null
    await fetchLedgerData()
  } catch (err) {
    alert('Payment registration failed: ' + err.message)
  } finally {
    submittingPayment.value = false
  }
}

onMounted(() => {
  fetchLedgerData()
})
</script>
