import { PrismaClient } from '../src/generated/prisma'
import jwt from 'jsonwebtoken'
import { env } from '../src/env'

const prisma = new PrismaClient()
const BASE_URL = `http://localhost:${env.PORT}`

async function main() {
  console.log('🚀 Starting Asset Movement Tests...')

  // 1. Setup Data
  console.log('📦 Seeding database...')
  
  // Create User
  const user = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      name: 'Admin Test',
      email: 'admin@test.com',
      password_hash: 'hash', // We won't login via API, just sign token
      role: 'ADMIN',
    },
  })

  // Generate Token
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }

  // Create Dependencies
  const supplier = await prisma.supplier.create({
    data: {
      company_name: 'Test Supplier ' + Date.now(),
      cnpj: '1' + Date.now().toString(), // Ensure uniqueness
      email: 'supplier@test.com',
      phone: '123456789',
      contact: 'Contact',
    }
  })

  const contract = await prisma.contract.create({
    data: {
      contract_number: 'CTR-' + Date.now(),
      clientId: supplier.id,
      start_date: new Date(),
      status: 'ACTIVE',
    }
  })

  const category = await prisma.assetCategory.upsert({
    where: { name: 'Test Category' },
    update: {},
    create: {
      name: 'Test Category',
      type: 'EQUIPMENT',
    }
  })

  const asset = await prisma.asset.create({
    data: {
      brand: 'Test Brand',
      model: 'Test Model',
      assetCategoryId: category.id,
      plate: 'TST-' + Math.floor(Math.random() * 10000),
    }
  })

  console.log('✅ Data seeded.')
  console.log(`Contract ID: ${contract.id}`)
  console.log(`Asset ID: ${asset.id}`)

  // 2. Run Tests
  let createdMovementId = ''

  // Test 1: Create Asset Movement
  console.log('\nTesting POST /asset-movements ...')
  const createRes = await fetch(`${BASE_URL}/asset-movements`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      contractId: contract.id,
      assetId: asset.id,
      rental_value: 1500.00,
      billing_cycle: 'MONTHLY',
      delivery_location: 'Site A',
    })
  })
  
  if (createRes.status === 201) {
    const data = await createRes.json()
    createdMovementId = data.assetMovement.id
    console.log('✅ Created:', createdMovementId)
  } else {
    console.error('❌ Failed to create:', createRes.status, await createRes.text())
    return
  }

  // Test 2: List Asset Movements
  console.log('\nTesting GET /asset-movements ...')
  const listRes = await fetch(`${BASE_URL}/asset-movements`, { headers })
  console.log(listRes.status === 200 ? '✅ Success' : '❌ Failed', await listRes.status)

  // Test 3: List Unpaginated
  console.log('\nTesting GET /asset-movements/unpaginated ...')
  const unpaginatedRes = await fetch(`${BASE_URL}/asset-movements/unpaginated`, { headers })
  console.log(unpaginatedRes.status === 200 ? '✅ Success' : '❌ Failed', await unpaginatedRes.status)

  // Test 4: Search
  console.log('\nTesting GET /asset-movements/search ...')
  const searchRes = await fetch(`${BASE_URL}/asset-movements/search?q=Site`, { headers })
  console.log(searchRes.status === 200 ? '✅ Success' : '❌ Failed', await searchRes.status)

  // Test 5: Get by ID
  console.log('\nTesting GET /asset-movements/:id ...')
  const getRes = await fetch(`${BASE_URL}/asset-movements/${createdMovementId}`, { headers })
  console.log(getRes.status === 200 ? '✅ Success' : '❌ Failed', await getRes.status)

  // Test 6: Get Details
  console.log('\nTesting GET /asset-movements/:id/details ...')
  const detailsRes = await fetch(`${BASE_URL}/asset-movements/${createdMovementId}/details`, { headers })
  console.log(detailsRes.status === 200 ? '✅ Success' : '❌ Failed', await detailsRes.status)

  // Test 7: Update Generic
  console.log('\nTesting PATCH /asset-movements/:id ...')
  const updateRes = await fetch(`${BASE_URL}/asset-movements/${createdMovementId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      notes: 'Updated notes',
    })
  })
  console.log(updateRes.status === 200 ? '✅ Success' : '❌ Failed', await updateRes.status)

  // Test 8: Update Billing Cycle
  console.log('\nTesting PATCH /asset-movements/:id/billing-cycle ...')
  const billingRes = await fetch(`${BASE_URL}/asset-movements/${createdMovementId}/billing-cycle`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      billing_cycle: 'WEEKLY',
    })
  })
  console.log(billingRes.status === 200 ? '✅ Success' : '❌ Failed', await billingRes.status)

  // Test 9: Update Dates
  console.log('\nTesting PATCH /asset-movements/:id/dates ...')
  const datesRes = await fetch(`${BASE_URL}/asset-movements/${createdMovementId}/dates`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      mobilization_date: new Date().toISOString(),
    })
  })
  console.log(datesRes.status === 200 ? '✅ Success' : '❌ Failed', await datesRes.status)

  // Test 10: By Contract
  console.log(`\nTesting GET /contracts/:contractId/asset-movements ...`)
  const byContractRes = await fetch(`${BASE_URL}/contracts/${contract.id}/asset-movements`, { headers })
  console.log(byContractRes.status === 200 ? '✅ Success' : '❌ Failed', await byContractRes.status)

  // Test 11: Summary By Contract
  console.log(`\nTesting GET /contracts/:contractId/asset-movements/summary ...`)
  const summaryRes = await fetch(`${BASE_URL}/contracts/${contract.id}/asset-movements/summary`, { headers })
  console.log(summaryRes.status === 200 ? '✅ Success' : '❌ Failed', await summaryRes.status)

  // Test 12: By Asset
  console.log(`\nTesting GET /assets/:assetId/asset-movements ...`)
  const byAssetRes = await fetch(`${BASE_URL}/assets/${asset.id}/asset-movements`, { headers })
  console.log(byAssetRes.status === 200 ? '✅ Success' : '❌ Failed', await byAssetRes.status)

  // Test 13: Active By Asset
  console.log(`\nTesting GET /assets/:assetId/asset-movements/active ...`)
  const activeRes = await fetch(`${BASE_URL}/assets/${asset.id}/asset-movements/active`, { headers })
  console.log(activeRes.status === 200 ? '✅ Success' : '❌ Failed', await activeRes.status)

  // Test 14: Delete
  console.log('\nTesting DELETE /asset-movements/:id ...')
  const deleteRes = await fetch(`${BASE_URL}/asset-movements/${createdMovementId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': headers.Authorization
    },
  })
  
  if (deleteRes.status === 204) {
    console.log('✅ Success')
  } else {
    console.log('❌ Failed', deleteRes.status, await deleteRes.text())
  }

  console.log('\n🏁 Tests Completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
