<template>
  <div class="min-h-screen bg-neutral-100 p-2 sm:p-6 print:p-0 print:m-0 print:bg-white print:min-h-0 flex flex-col justify-between">
    <main class="max-w-4xl mx-auto w-full print:max-w-none print:w-full print:m-0">

      <!-- TOP ACTION BAR (Hidden when printing) -->
      <div v-if="!loading && !error" class="mb-4 flex items-center justify-between print:hidden bg-white p-3 sm:p-4 rounded-xl border border-neutral-200 shadow-sm">
        <button
          @click="goBack"
          class="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        <div class="flex items-center gap-2">
          <button
            @click="triggerPrint"
            class="px-3 sm:px-4 py-2 bg-black text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Invoice
          </button>
        </div>
      </div>

      <!-- LOADING STATE -->
      <div v-if="loading" class="bg-white rounded-xl border border-neutral-200 p-8 text-center shadow-sm">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-neutral-200 border-t-black mb-3"></div>
        <p class="text-xs sm:text-sm text-neutral-500 font-medium">Fetching verified invoice records...</p>
      </div>

      <!-- ERROR STATE (Invalid UUID or Not Found) -->
      <div v-else-if="error" class="bg-white rounded-xl border border-red-200 p-8 text-center shadow-sm max-w-md mx-auto my-12 space-y-4">
        <div class="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-neutral-900 mb-1">Invoice Verification Failed</h3>
          <p class="text-xs text-neutral-500">{{ error }}</p>
        </div>
        <button
          @click="goBack"
          class="w-full py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors"
        >
          Return to Application
        </button>
      </div>

      <!-- INVOICE PREVIEW COMPONENT -->
      <div v-else-if="sale" class="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6 shadow-md print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none">
        <InvoicePrint
          :sale="sale"
          :customer="sale.customers"
          :baseUrl="currentBaseUrl"
        />
      </div>

    </main>

    <!-- FOOTER FOR PUBLIC VERIFICATION CONTEXT (Hidden when printing) -->
    <footer v-if="!loading && !error" class="mt-8 text-center text-xs text-neutral-400 print:hidden">
      <p>© {{ new Date().getFullYear() }} Shagun Enterprises • Verified Public Sales Record</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import InvoicePrint from '@/components/InvoicePrint.vue'

const route = useRoute()
const router = useRouter()

const sale = ref(null)
const loading = ref(true)
const error = ref(null)

const currentBaseUrl = computed(() => {
  return window.location.origin
})

function triggerPrint() {
  window.print()
}

function goBack() {
  router.push({ name: 'dashboard' })
}

onMounted(async () => {
  const saleId = route.params.id

  if (!saleId) {
    error.value = 'Invalid verification link. Missing transaction identifier.'
    loading.value = false
    return
  }

  try {
    const { data, error: fetchError } = await supabase
      .from('sales')
      .select('*, customers(*)')
      .eq('id', saleId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw new Error('This invoice record does not exist or has been removed.')
      }
      throw fetchError
    }

    sale.value = data

    if (route.query.print === 'true') {
      await nextTick()
      setTimeout(() => {
        triggerPrint()
      }, 350)
    }

  } catch (err) {
    error.value = err.message || 'An unexpected error occurred while verifying the invoice.'
  } finally {
    loading.value = false
  }
})
</script>

<style>
/* CSS Page Rule overrides default browser margins that cause ghost pages */
@media print {
  @page {
    margin: 10mm;
    size: auto;
  }

  html, body {
    height: auto !important;
    overflow: visible !important;
    background: #fff !important;
  }
}
</style>
