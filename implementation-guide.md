# Implementation Changes Based on Backend API

## 1. Guardian Interface Update in orphan-types.ts
```typescript
export interface Guardian {
  publicId?: string
  name: string
  relationship: string
  contactNumber: string  // Use contactNumber instead of phoneNumber
  sex?: string          // Added as per backend request body
  email: string
  address: string
  occupation: string
  orphanPublicId?: string  // Added to match API request
}
```

## 2. GuardianForm Component Updates
1. Add `sex` field with Male/Female/Other options
2. Replace phoneNumber with contactNumber throughout
3. Use consistent case for relationship values ("Uncle" instead of "UNCLE")

```typescript
// Form state variables
const [sex, setSex] = useState('Male')
const [contactNumber, setContactNumber] = useState('')
```

## 3. Guardian API Endpoints Updates
1. Add Guardian:
   - URL: `/app/oims/orphans/guardians`
   - Method: POST
   - Body: include orphanPublicId in the request

2. Update Guardian:
   - URL: `/app/oims/orphans/guardians`
   - Method: PATCH
   - Body: include publicId and orphanPublicId

3. Delete Guardian:
   - URL: `/app/oims/orphans/guardians/{guardianPublicId}`
   - Method: DELETE
   - Use the guardian's publicId, not the orphan's

## 4. Update the functions in orphan-details-personal.tsx:

```typescript
const handleAddGuardian = async (guardianData: Guardian) => {
  // Include orphanPublicId
  const enrichedData = { ...guardianData, orphanPublicId: orphan.publicId }
  const response = await API.post(`/app/oims/orphans/guardians`, enrichedData)
  // ...rest of function
}

const handleUpdateGuardian = async (guardianData: Guardian) => {
  // Include publicId and orphanPublicId
  const enrichedData = {
    ...guardianData, 
    publicId: orphan.guardian?.publicId,
    orphanPublicId: orphan.publicId
  }
  const response = await API.patch(`/app/oims/orphans/guardians`, enrichedData)
  // ...rest of function
}

const handleDeleteGuardian = async () => {
  if (!orphan?.guardian?.publicId) return;
  await API.delete(`/app/oims/orphans/guardians/${orphan.guardian.publicId}`)
  // ...rest of function
}
```

5. Pass orphanId to GuardianForm and update the GuardianForm component props.
