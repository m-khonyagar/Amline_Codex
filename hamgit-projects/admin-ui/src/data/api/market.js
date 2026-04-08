import { apiRequest } from '../services/index.js'

export function apiGetLandlordFiles(params) {
  return apiRequest.get('/crm/landlord-files', { params })
}

export function apiGetTenantFiles(params) {
  return apiRequest.get('/crm/tenant-files', { params })
}

export function apiGetRealtorFiles(params) {
  return apiRequest.get('/crm/realtor-files', { params })
}

export function apiGetLandlordFileInfo(id) {
  return apiRequest.get(`/crm/landlord-files/${id}`)
}

export function apiGetTenantFileInfo(id) {
  return apiRequest.get(`/crm/tenant-files/${id}`)
}

export function apiDownloadLandlordFilesExcel() {
  return apiRequest.get('/crm/tools/landlord-files-excel', { responseType: 'blob' })
}

export function apiDownloadTenantFilesExcel() {
  return apiRequest.get('/crm/tools/tenant-files-excel', { responseType: 'blob' })
}

export function apiGetRealtorFileInfo(id) {
  return apiRequest.get(`/crm/realtor-files/${id}`)
}

export function apiCreateLandlordFiles(data) {
  return apiRequest.post('/crm/landlord-files', data)
}

export function apiCreateTenantFiles(data) {
  return apiRequest.post('/crm/tenant-files', data)
}

export function apiCreateRealtorFiles(data) {
  return apiRequest.post('/crm/realtor-files', data)
}

export function apiUpdateLandlordFiles(id, data) {
  return apiRequest.put(`/crm/landlord-files/${id}`, data)
}

export function apiUpdateTenantFiles(id, data) {
  return apiRequest.put(`/crm/tenant-files/${id}`, data)
}

export function apiUpdateRealtorFiles(id, data) {
  return apiRequest.put(`/crm/realtor-files/${id}`, data)
}

export function apiPublishLandlordFile(id, data = {}) {
  return apiRequest.post(`/crm/landlord-files/${id}/publish`, data)
}

export function apiPublishTenantFile(id, data = {}) {
  return apiRequest.post(`/crm/tenant-files/${id}/publish`, data)
}

export function apiGetAdModerators() {
  return apiRequest.get('/crm/tools/ajax/ad-moderators')
}

export function apiGetAllHistoryFiles(id) {
  return apiRequest.get(`/crm/tools/all-history/${id}`)
}

export function apiGetHistoryFiles(id, params = {}) {
  return apiRequest.get(`/crm/tools/history/${id}`, {
    params,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams()

      for (const key in params) {
        const value = params[key]
        if (Array.isArray(value)) value.forEach((v) => searchParams.append(key, v))
        else searchParams.append(key, value)
      }

      return searchParams.toString()
    },
  })
}

export function apiGetFileTexts(id) {
  return apiRequest.get(`/crm/file-texts/${id}/texts`)
}

export function apiGetFileCalls(id) {
  return apiRequest.get(`/crm/file-calls/${id}/calls`)
}

export function apiSendSms(data) {
  return apiRequest.post('/crm/file-texts', data)
}

export function apiSendFileCall(data) {
  return apiRequest.post('/crm/file-calls', data)
}

export function apiGetFileSources() {
  return apiRequest.get('/crm/tools/file-source')
}

export function apiCreateFileSource(data) {
  return apiRequest.post('/crm/tools/file-source', data)
}

export function apiUpdateFileSource(id, data) {
  return apiRequest.put(`/crm/tools/file-source/${id}`, data)
}

export function apiDeleteFileSource(id) {
  return apiRequest.delete(`/crm/tools/file-source/${id}`)
}

export function apiGetFileLabels(params) {
  return apiRequest.get('/crm/tools/file-label', { params })
}

export function apiCreateFileLabel(data) {
  return apiRequest.post('/crm/tools/file-label', data)
}

export function apiUpdateFileLabel(id, data) {
  return apiRequest.put(`/crm/tools/file-label/${id}`, data)
}

export function apiDeleteFileLabel(id) {
  return apiRequest.delete(`/crm/tools/file-label/${id}`)
}

export function apiGetExistingMobile(mobile) {
  return apiRequest.get(`/crm/tools/existing-customer/${mobile}`)
}

export function apiCreateFileConnection(data) {
  return apiRequest.post('/crm/file-connections', data)
}

export function apiGetFileConnections(params) {
  return apiRequest.get('/crm/file-connections', { params })
}

export function apiDeleteFileConnection(id) {
  return apiRequest.delete(`/crm/file-connections/${id}`)
}

export function apiUpdateFileConnection(id, data) {
  return apiRequest.put(`/crm/file-connections/${id}`, data)
}

export function apiGetTasks(params) {
  return apiRequest.get('/crm/tools/task', { params })
}

export function apiGetTaskInfo(id) {
  return apiRequest.get(`/crm/tools/task/${id}`)
}

export function apiCreateTask(data) {
  return apiRequest.post('/crm/tools/task', data)
}

export function apiUpdateTask(id, data) {
  return apiRequest.put(`/crm/tools/task/${id}`, data)
}

export function apiAddReportTask(data) {
  return apiRequest.post('/crm/tools/task-report', data)
}

export function apiSendFileToRealtorByCategory(data) {
  return apiRequest.post('/crm/tools/send-file-to-realtor-by-category', data)
}

export function apiSendFileToRealtorByIds(data) {
  return apiRequest.post('/crm/tools/send-file-to-realtor-by-ids', data)
}

export function apiGetRealtorSharedFiles(fileId) {
  return apiRequest.get(`/crm/tools/realtor-shared-files/${fileId}`)
}

export function apiGetTitleAi(fileId) {
  return apiRequest.get(`/crm/tools/ai-title-generator/${fileId}`)
}

export function apiMatchLandlordFile(fileId) {
  return apiRequest.get(`/crm/landlord-files/${fileId}/match`)
}

export function apiMatchTenantFile(fileId) {
  return apiRequest.get(`/crm/tenant-files/${fileId}/match`)
}
