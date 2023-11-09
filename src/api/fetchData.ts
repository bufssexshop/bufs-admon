const defaultHost = 'https://bufs-api.onrender.com' || process.env.NEXT_PUBLIC_API_URL

let token = ''

type TMutationData = {
  path: string;
  method?: "POST" | "PUT" | "DELETE";
  body: any;
};

if (typeof window !== 'undefined') {
  token = localStorage.getItem('sexshop-token') || ''
}

export async function mutationData (path: string, method: string = 'POST', body = {}) {
  const res = await fetch(`${defaultHost}/${path}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )
  const data = await res.json()
  return data
}

export async function getData (path: string) {
  const res = await fetch(`${defaultHost}/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  return data
}