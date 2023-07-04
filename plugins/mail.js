import axios from 'axios'

export default function ({ $config }, inject) {
  const sendEmail = async (data) => {
    try {
      const response = await axios.post($config.sendEmailFunctionURL, data)
      return response.data
    } catch (error) {
      throw new Error('Failed to send email')
    }
  }

  inject('sendEmail', sendEmail)
}
