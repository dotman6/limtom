/* plugins/client.js */
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.API_KEY)
export default (_, inject) => {
  inject('supabase', supabase)
}
