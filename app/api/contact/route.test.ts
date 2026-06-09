import { POST } from './route'

async function makeRequest(body: Record<string, string>) {
  return POST(new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }))
}

describe('POST /api/contact', () => {
  it('returns 400 when name is missing', async () => {
    const res = await makeRequest({ email: 'a@b.com', message: 'hi' })
    expect(res.status).toBe(400)
  })

  it('returns 400 when email is missing', async () => {
    const res = await makeRequest({ name: 'Alice', message: 'hi' })
    expect(res.status).toBe(400)
  })

  it('returns 400 when message is missing', async () => {
    const res = await makeRequest({ name: 'Alice', email: 'a@b.com' })
    expect(res.status).toBe(400)
  })

  it('returns 200 with success for valid input', async () => {
    const res = await makeRequest({ name: 'Alice', email: 'a@b.com', message: 'Hello' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })
})
