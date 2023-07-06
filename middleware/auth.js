export default async function ({ $supabase, redirect }) {
  //Get user session
  const { data: user } = await $supabase.auth.getUser()
  //Check if user is authenticated || user.user.role !== 'authenticated'
  if (!user) {
    return redirect('/auth/login')
  }
}
