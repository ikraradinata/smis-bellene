import { NextResponse } from 'next/server'

export async function proxyToRemoteIfConfigured(req, pathname) {
  const remoteBase = process.env.REMOTE_API_BASE
  if (!remoteBase) return null

  try {
    const targetUrl = `${remoteBase.replace(/\/$/, '')}${pathname}`
    const options = {
      method: req.method,
      headers: {
        'content-type': req.headers.get('content-type') || 'application/json',
      },
    }

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      try {
        const bodyText = await req.clone().text()
        if (bodyText) options.body = bodyText
      } catch (e) {
        // body unreadable or empty
      }
    }

    const res = await fetch(targetUrl, options)
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await res.json()
      return NextResponse.json(data, { status: res.status })
    } else {
      const text = await res.text()
      return new NextResponse(text, {
        status: res.status,
        headers: { 'content-type': contentType },
      })
    }
  } catch (err) {
    console.error('API Proxy Error:', err)
    return NextResponse.json({ error: 'Failed to reach remote API: ' + err.message }, { status: 502 })
  }
}
