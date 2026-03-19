import { uploadToB2 } from './src/lib/storage'

async function runTest() {
  console.log('--- Testando Diagnóstico de B2 ---')
  try {
    // Tenta fazer upload (deve falhar se algo estiver faltando)
    await uploadToB2(Buffer.from('test'), 'test.txt', 'text/plain')
    console.log('✅ Upload funcionou (B2 está configurado localmente)')
  } catch (error: any) {
    console.log('❌ Erro esperado capturado:')
    console.log(error.message)
  }
}

runTest()
