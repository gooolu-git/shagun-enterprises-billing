<template>
  <div class="min-h-screen bg-neutral-50/50 pb-12 pt-6">
    <div class="mx-auto max-w-5xl px-6">

      <!-- Back Navigation -->
      <div class="mb-6">
        <router-link
          to="/customers"
          class="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <font-awesome-icon icon="fa-solid fa-chevron-left" class="w-3 h-3" />
          Back to Customer List
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-12 text-center text-neutral-400">
        <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-2xl text-neutral-600 mb-2" />
        <p class="text-sm font-medium text-neutral-600">Loading customer profile...</p>
      </div>

      <div v-else-if="customer" class="space-y-6">

        <!-- Profile Header Card -->
        <div class="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div class="flex items-center gap-5">
            <div
              v-html="avatarSvg"
              class="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 [&>svg]:h-full [&>svg]:w-full shadow-sm"
            ></div>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-neutral-900">{{ customer.name }}</h1>
                <span
                  :class="[
                    totalDues > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    'inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border'
                  ]"
                >
                  {{ totalDues > 0 ? 'Pending Dues' : 'Account Clear' }}
                </span>
              </div>
              <p class="text-sm text-neutral-600 font-mono mt-0.5">
                <font-awesome-icon icon="fa-solid fa-phone" class="mr-1 text-neutral-400 w-3 h-3" />
                {{ customer.phone_number }}
                <span v-if="customer.whatsapp_number" class="ml-2 text-neutral-400 font-sans">
                  (WhatsApp: {{ customer.whatsapp_number }})
                </span>
              </p>
              <p class="text-xs text-neutral-400 mt-1">{{ customer.address || 'No primary address configured' }}</p>
            </div>
          </div>
        </div>

        <!-- Metric Summaries -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
            <p class="text-xs font-medium text-neutral-400">Total Outstanding Balance</p>
            <p
              :class="[
                totalDues > 0 ? 'text-amber-600' : 'text-emerald-600',
                'text-2xl font-bold mt-1'
              ]"
            >
              ₹{{ totalDues.toLocaleString('en-IN') }}
            </p>
          </div>

          <div class="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
            <p class="text-xs font-medium text-neutral-400">Lifetime Purchases</p>
            <p class="text-2xl font-bold text-neutral-900 mt-1">
              ₹{{ lifetimePurchases.toLocaleString('en-IN') }}
            </p>
          </div>

          <div class="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs">
            <p class="text-xs font-medium text-neutral-400">Total Items Purchased</p>
            <p class="text-2xl font-bold text-neutral-900 mt-1">
              {{ customer.sales?.length || 0 }}
            </p>
          </div>
        </div>

        <!-- Sales Line Items / Ledger Table -->
        <div class="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs">
          <div class="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 class="font-bold text-neutral-900 text-base">Sales Ledger & Line Items</h2>
            <span class="text-xs text-neutral-400">{{ customer.sales?.length || 0 }} sales records</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="border-b border-neutral-100 bg-neutral-50/50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <tr>
                  <th scope="col" class="px-6 py-3.5">Item</th>
                  <th scope="col" class="px-6 py-3.5">Category</th>
                  <th scope="col" class="px-6 py-3.5">IMEI / Serial</th>
                  <th scope="col" class="px-6 py-3.5">Date</th>
                  <th scope="col" class="px-6 py-3.5">Price</th>
                  <th scope="col" class="px-6 py-3.5">Paid</th>
                  <th scope="col" class="px-6 py-3.5">Remaining</th>
                  <th scope="col" class="px-6 py-3.5">Status</th>
                  <th scope="col" class="px-6 py-3.5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100 text-neutral-700">
                <tr
                  v-for="sale in customer.sales"
                  :key="sale.id"
                  class="hover:bg-neutral-50/80 transition-colors"
                >
                  <td class="px-6 py-4 font-semibold text-neutral-900">{{ sale.item_name }}</td>
                  <td class="px-6 py-4 capitalize text-xs text-neutral-500">{{ sale.item_category ? sale.item_category.replace('_', ' ') : 'N/A' }}</td>
                  <td class="px-6 py-4 font-mono text-xs text-neutral-600">{{ sale.imei_or_serial_no || 'N/A' }}</td>
                  <td class="px-6 py-4 text-xs text-neutral-500">{{ sale.sale_date }}</td>
                  <td class="px-6 py-4 font-medium text-neutral-900">₹{{ Number(sale.price).toLocaleString('en-IN') }}</td>
                  <td class="px-6 py-4 text-emerald-600 font-medium">₹{{ Number(sale.paid_amount).toLocaleString('en-IN') }}</td>
                  <td class="px-6 py-4 font-semibold text-neutral-900">₹{{ Number(sale.remaining_amount).toLocaleString('en-IN') }}</td>
                  <td class="px-6 py-4">
                    <span
                      :class="[
                        sale.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        sale.payment_status === 'partial' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200',
                        'inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md border capitalize'
                      ]"
                    >
                      {{ sale.payment_status }}
                    </span>
                  </td>
                  <!-- Invoice Redirect Button Column -->
                  <td class="px-6 py-4 text-right">
                    <router-link
                      :to="{ name: 'verify-sale', params: { id: sale.id } }"
                      target="_blank"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg border border-neutral-200 transition-all cursor-pointer shadow-2xs"
                      title="View & Print Invoice"
                    >
                      <font-awesome-icon icon="fa-solid fa-receipt" class="w-3 h-3" />
                      Invoice
                    </router-link>
                  </td>
                </tr>
                <tr v-if="!customer.sales || customer.sales.length === 0">
                  <td colspan="9" class="px-6 py-8 text-center text-neutral-400">
                    No sales recorded for this customer.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Not Found -->
      <div v-else class="py-12 text-center text-neutral-400">
        <p class="text-lg font-semibold text-neutral-700">Customer record not found</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { Style, Avatar } from '@dicebear/core'
import avataaars from '@dicebear/styles/avataaars.json' with { type: 'json' }

const route = useRoute()
const style = new Style(avataaars)
const customer = ref(null)
const loading = ref(true)

async function fetchCustomerDetails() {
  try {
    loading.value = true
    const customerId = route.params.id

    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        sales (
          id,
          item_name,
          item_category,
          imei_or_serial_no,
          price,
          paid_amount,
          remaining_amount,
          payment_status,
          sale_date,
          status,
          payments (
            id,
            amount_paid,
            payment_method,
            created_at
          )
        )
      `)
      .eq('id', customerId)
      .single()

    if (error) throw error
    customer.value = data
  } catch (err) {
    console.error('Error fetching customer profile:', err.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCustomerDetails()
})

const activeSales = computed(() => {
  return customer.value?.sales?.filter(s => s.status === 'active') || []
})

const totalDues = computed(() => {
  return activeSales.value.reduce((sum, s) => sum + Number(s.remaining_amount || 0), 0)
})

const lifetimePurchases = computed(() => {
  return activeSales.value.reduce((sum, s) => sum + Number(s.price || 0), 0)
})

const avatarSvg = computed(() => {
  if (!customer.value) return ''
  const avatar = new Avatar(style, {
    seed: customer.value.phone_number || customer.value.name,
    topProbability: 100,
    topVariant: ['shortFlat', 'shortWaved', 'shortRound', 'shavedSides'],
    hairColor: ['2c1b18', '4a312c', '000000'],
    clothesVariant: ['blazerAndShirt', 'shirtCrewNeck', 'collarAndSweater'],
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc']
  })
  return avatar.toString()
})
</script>
