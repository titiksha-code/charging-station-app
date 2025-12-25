<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <h2>{{ isEdit ? 'Edit Station' : 'Add New Station' }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Station Name *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="form-input"
            placeholder="Enter station name"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="latitude">Latitude *</label>
            <input
              id="latitude"
              v-model.number="formData.location.latitude"
              type="number"
              step="any"
              required
              class="form-input"
              placeholder="e.g., 37.7749"
            />
          </div>

          <div class="form-group">
            <label for="longitude">Longitude *</label>
            <input
              id="longitude"
              v-model.number="formData.location.longitude"
              type="number"
              step="any"
              required
              class="form-input"
              placeholder="e.g., -122.4194"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="powerOutput">Power Output (kW) *</label>
          <input
            id="powerOutput"
            v-model.number="formData.powerOutput"
            type="number"
            min="1"
            required
            class="form-input"
            placeholder="e.g., 50"
          />
        </div>

        <div class="form-group">
          <label for="ConnectorTypeForm">Connector Type *</label>
          <select
            id="ConnectorTypeForm"
            v-model="formData.connectorType"
            required
            class="form-input"
          >
            <option value="">Select connector type</option>
            <option value="Type 1">Type 1</option>
            <option value="Type 2">Type 2</option>
            <option value="CCS">CCS</option>
            <option value="CHAdeMO">CHAdeMO</option>
            <option value="Tesla Supercharger">Tesla Supercharger</option>
          </select>
        </div>

        <div class="form-group">
          <label for="status">Status *</label>
          <select id="status" v-model="formData.status" required class="form-input">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn btn-cancel">Cancel</button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Saving...' : isEdit ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { ChargingStation } from '@/types'
import { useStationsStore } from '@/stores/stations'

interface Props {
  station?: ChargingStation | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const stationsStore = useStationsStore()
const loading = ref(false)
const error = ref('')

const isEdit = !!props.station

// Keep the type for form data which allows empty string
type ConnectorTypeForm = 'Type 1' | 'Type 2' | 'CCS' | 'CHAdeMO' | 'Tesla Supercharger' | ''

const formData = reactive({
  name: props.station?.name || '',
  location: {
    latitude: props.station?.location.latitude || 0,
    longitude: props.station?.location.longitude || 0,
  },
  powerOutput: props.station?.powerOutput || 0,
  connectorType: (props.station?.connectorType || '') as ConnectorTypeForm,
  status: props.station?.status || ('Active' as 'Active' | 'Inactive'),
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    // Create a clean data object without empty strings
    const stationData = {
      name: formData.name,
      location: formData.location,
      powerOutput: formData.powerOutput,
      status: formData.status,
      // Only include connectorType if it's not empty
      ...(formData.connectorType && {
        connectorType: formData.connectorType as ChargingStation['connectorType'],
      }),
    }

    if (isEdit && props.station?._id) {
      await stationsStore.updateStation(props.station._id, stationData)
    } else {
      // For create, connectorType is required, so ensure it's not empty
      if (!formData.connectorType) {
        error.value = 'Please select a connector type'
        return
      }
      await stationsStore.createStation({
        ...stationData,
        connectorType: formData.connectorType as ChargingStation['connectorType'],
      })
    }
    emit('saved')
    emit('close')
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message
    } else if (typeof err === 'object' && err !== null && 'response' in err) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Failed to save station'
    } else {
      error.value = 'Failed to save station'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
}

.error-message {
  padding: 0.75rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel {
  background: #e5e7eb;
  color: #374151;
}

.btn-cancel:hover {
  background: #d1d5db;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
