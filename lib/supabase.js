const { createServerClient, parseCookieHeader, serializeCookieHeader } = require('@supabase/ssr')


const createClient = (context) => {
  return createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.req.headers.cookie ?? '')
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          context.res.appendHeader('Set-Cookie', serializeCookieHeader(name, value, options))
        )
      },
    },
  })
}

const checkSession = async (context) => {
    try {
        const supabase = createClient(context)
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return { isSignedIn: false, user: null, error }
        }

        return { isSignedIn: true, user, error: null }
    } catch (error) {
        return { isSignedIn: false, user: null, error }
    }

}

module.exports = {checkSession, createClient}
