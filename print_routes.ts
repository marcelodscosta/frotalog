import { app } from './src/app'
async function print() {
  await app.ready()
  console.log(app.printRoutes())
}
print()
