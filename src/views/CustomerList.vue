<template>
  <div class="min-h-screen bg-neutral-50/50 pb-12 pt-6">
    <div class="mx-auto max-w-5xl px-6">

      <!-- Page Header -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-neutral-900">Customers</h1>
          <p class="text-sm text-neutral-500">Manage customer directories, search accounts, and view outstanding dues.</p>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="mb-6 flex items-center gap-3">
        <div class="relative flex-1">
          <font-awesome-icon
            icon="fa-solid fa-magnifying-glass"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by phone number or name..."
            class="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-all shadow-xs"
          />
        </div>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="px-3 py-2.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Clear
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-12 text-center text-neutral-400">
        <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-2xl text-neutral-600 mb-2" />
        <p class="text-sm font-medium text-neutral-600">Loading customer directory...</p>
      </div>

      <!-- Customer List Table -->
      <div v-else class="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-neutral-100 bg-neutral-50/50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <tr>
                <th scope="col" class="px-6 py-3.5">Customer</th>
                <th scope="col" class="px-6 py-3.5">Phone Number</th>
                <th scope="col" class="px-6 py-3.5">Total Billed</th>
                <th scope="col" class="px-6 py-3.5">Outstanding Due</th>
                <th scope="col" class="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 text-neutral-700">
              <tr
                v-for="customer in filteredCustomers"
                :key="customer.id"
                class="hover:bg-neutral-50/80 transition-colors group"
              >
                <!-- Avatar & Name -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      v-html="getAvatarSvg(customer.phone_number || customer.name)"
                      class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 [&>svg]:h-full [&>svg]:w-full"
                    ></div>
                    <div>
                      <p class="font-semibold text-neutral-900">{{ customer.name }}</p>
                      <p class="text-xs text-neutral-400">{{ customer.address || 'No address saved' }}</p>
                    </div>
                  </div>
                </td>

                <!-- Phone Number -->
                <td class="px-6 py-4 font-mono text-xs font-medium text-neutral-600">
                  {{ customer.phone_number }}
                </td>

                <!-- Total Billed -->
                <td class="px-6 py-4 font-medium text-neutral-900">
                  ₹{{ customer.totalBilled.toLocaleString('en-IN') }}
                </td>

                <!-- Pending Due -->
                <td class="px-6 py-4 font-medium">
                  <span
                    :class="[
                      customer.totalDue > 0 ? 'text-amber-600 font-semibold' : 'text-emerald-600 font-normal'
                    ]"
                  >
                    ₹{{ customer.totalDue.toLocaleString('en-IN') }}
                  </span>
                </td>

                <!-- Action Button -->
                <td class="px-6 py-4 text-right">
                  <router-link
                    :to="`/customers/${customer.id}`"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all cursor-pointer shadow-xs"
                  >
                    View Details
                    <font-awesome-icon icon="fa-solid fa-arrow-right" class="w-3 h-3 text-neutral-400" />
                  </router-link>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredCustomers.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-neutral-400">
                  <p class="text-base font-medium text-neutral-700">No matching customers found</p>
                  <p class="text-xs text-neutral-400 mt-1">Try typing a phone number or customer name.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { Style, Avatar } from '@dicebear/core'
import avataaars from '@dicebear/styles/avataaars.json' with { type: 'json' }

const style = new Style(avataaars)
const searchQuery = ref('')
const customers = ref([])
const loading = ref(true)

async function fetchCustomers() {
  try {
    loading.value = true
    // Fetch customers along with active sales aggregations
    const { data, error } = await supabase
      .from('customers')
      .select(`
        id,
        name,
        phone_number,
        whatsapp_number,
        address,
        sales (
          price,
          remaining_amount,
          status
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform row metrics
    customers.value = (data || []).map(cust => {
      const activeSales = cust.sales?.filter(s => s.status === 'active') || []
      const totalBilled = activeSales.reduce((sum, s) => sum + Number(s.price || 0), 0)
      const totalDue = activeSales.reduce((sum, s) => sum + Number(s.remaining_amount || 0), 0)

      return {
        ...cust,
        totalBilled,
        totalDue
      }
    })
  } catch (err) {
    console.error('Error fetching customers:', err.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCustomers()
})

const filteredCustomers = computed(() => {
  if (!searchQuery.value.trim()) return customers.value
  const query = searchQuery.value.toLowerCase().trim()
  return customers.value.filter(customer =>
    (customer.phone_number && customer.phone_number.toLowerCase().includes(query)) ||
    (customer.name && customer.name.toLowerCase().includes(query))
  )
})

function getAvatarSvg(seed) {
  const avatar = new Avatar(style, {
    seed: seed || 'Shagun',
    topProbability: 100,
    topVariant: ['shortFlat', 'shortWaved', 'shortRound', 'shavedSides'],
    hairColor: ['2c1b18', '4a312c', '000000'],
    clothesVariant: ['blazerAndShirt', 'shirtCrewNeck', 'collarAndSweater'],
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc']
  })
  return avatar.toString()
}
</script>
