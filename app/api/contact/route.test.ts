import { POST } from './route'

async function makeRequest(body: Record<string, string>) {
  return POST(new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }))
}

describe('POST /api/contact', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

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

  it('forwards valid input to the webhook (GET + query params) and returns success', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 200 })
    )
    const res = await makeRequest({ name: 'Alice', email: 'a@b.com', message: 'Hello' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url = new URL(String(fetchMock.mock.calls[0][0]))
    expect(url.searchParams.get('name')).toBe('Alice')
    expect(url.searchParams.get('email')).toBe('a@b.com')
    expect(url.searchParams.get('message')).toBe('Hello')
  })

  it('returns 502 when the webhook fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    const res = await makeRequest({ name: 'Alice', email: 'a@b.com', message: 'Hello' })
    expect(res.status).toBe(502)
  })
})
