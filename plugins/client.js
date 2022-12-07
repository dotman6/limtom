/* plugins/client.js */
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  'https://wfcbtmmohzbmlvjeasbz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmY2J0bW1vaHpibWx2amVhc2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njk5OTcyODksImV4cCI6MTk4NTU3MzI4OX0.H1vhy_kBfWv7U4gcAkBdeZSNL5M6WmJdKASJQRQBrjo'
)
export default (_, inject) => {
  inject('supabase', supabase)
}
