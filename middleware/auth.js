import _ from '~/plugins/client'
export default function ({ app }) {
  const user = JSON.parse(
    app.$supabase.auth.storage.getItem(app.$supabase.auth.storageKey)
  )
  if (user && user.user.user_metadata.role === 'admin') {
    console.log('logged in')
    // return redirect('/admin/dashboard')
  } else {
    console.log('Not logged in')
    // return redirect('/')
  }
}
