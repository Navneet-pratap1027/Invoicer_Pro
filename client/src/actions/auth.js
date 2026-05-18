import * as api from '../api/index'
import { AUTH, CREATE_PROFILE } from './constants'
// 1. SIGN IN ACTION
export const signin = (formData, openSnackbar, setLoading) => async (dispatch) => {
    try {
        setLoading(true)
        // Login API hit karein
        const { data } = await api.signIn(formData)
        dispatch({ type: AUTH, data })
        openSnackbar("Signin successful")
        // Redirect to dashboard
        window.location.href = "/dashboard"
    } catch (error) {
        console.error("Frontend Signin Error:", error)
        const errorMessage = error?.response?.data?.message || "Invalid credentials. Please try again."
        openSnackbar(errorMessage)
        setLoading(false)
    }
}
// 2. SIGN UP ACTION (FIXED)
export const signup = (formData, openSnackbar, setLoading) => async (dispatch) => {
    try {
        setLoading(true)
            // 1. Core Sign up API
        const { data } = await api.signUp(formData)
        dispatch({ type: AUTH, data })
        // 2. Profile auto-creation 
        try {
            const profileData = {
                name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || data?.result?.name,
                email: data?.result?.email,
                userId: data?.result?._id,
                phoneNumber: '',
                businessName: '',
                contactAddress: '',
                logo: '',
                website: ''
            }
            const { info } = await api.createProfile(profileData)
            if (info) {
                dispatch({ type: CREATE_PROFILE, payload: info })
            }
        } catch (profileError) {
            console.warn("Profile creation template skipped or non-responsive:", profileError)
        }
        openSnackbar("Sign up successful")
        // Redirect to dashboard immediately
        window.location.href = "/dashboard"
    } catch (error) {
        console.error("Frontend Signup Error:", error)
        const errorMessage = error?.response?.data?.message || "Something went wrong during signup."
        openSnackbar(errorMessage)
        setLoading(false)
    }
}
// 3. FORGOT PASSWORD ACTION
export const forgot = (formData) => async (dispatch) => {
    try {
        await api.forgot(formData)
    } catch (error) {
        console.error("Forgot Password Action Error:", error)
    }
}
// 4. RESET PASSWORD ACTION
export const reset = (formData, history) => async (dispatch) => {
    try {
        await api.reset(formData)
        history.push('/dashboard')
    } catch (error) {
        console.error("Reset Password Action Error:", error)
        alert(error?.response?.data?.message || "Failed to reset password.")
    }
}