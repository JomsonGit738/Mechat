import React from 'react'
import './Auth.css'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { GoogleSignInUser, loginUser } from '../services/apiCalls'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux'
import { setUser } from '../features/slice'

function Login() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6)
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  //mechat account sign in
  const onSubmit = async (data) => {
    const loginResponse = await loginUser(data)
    //console.log(loginResponse);
    if (loginResponse.status === 200) {
      sessionStorage.setItem('userInfo', JSON.stringify(loginResponse.data))
      dispatch(setUser(loginResponse.data))
      navigate('/home')
    } else {
      toast.error(loginResponse.response.data, {
        autoClose: 2000
      })
    }
  }

  //Google sign in
  const Success = async (data) => {
    //decoding with jwt
    const { email, name, picture } = jwt_decode(data.credential)
    const body = {
      username: name,
      email,
      password: "#23Gsin",
      url: picture,
      mobile: "#45Gauth"
    }

    const googleSignInResponse = await GoogleSignInUser(body)
    if (googleSignInResponse.status === 200) {
      sessionStorage.setItem('userInfo', JSON.stringify(googleSignInResponse.data))
      dispatch(setUser(googleSignInResponse.data))
      navigate('/home')
    } else {
      toast.error("Google Sign in Error! try sign Up!")
    }
  }

  const Error = (err) => {
    console.log(err);
    toast.error("Google Sign in Error! try sign Up!")
  }



  return (
    <div className='loginContainer signinContainer'>
      {/* header css from Home.css */}
      <div className='s_tag'>
        <img src="https://i.postimg.cc/wjjTDwgj/chat.png" alt="" />
        <h3>MeChat</h3>
      </div>
      <div className='signin'>
        <div className='signin_body'>
          <div className='singinImage'>
            <img src="https://i.postimg.cc/wjjTDwgj/chat.png" alt="" />
            <h2>MeChat</h2>
            <p>Let's chit chat on MeChat!</p>
            <span>We recommend sign in with google account to easily connect with friends.</span>
          </div>
          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className='loginForm'>
            <h2 style={{ fontSize: '25px', fontWeight: 'bold' }}>Sign In</h2>

            <div className='formInput' style={{ marginTop: "20px" }}>
              <input type="email" id='email' placeholder=' '
                {...register("email")} />
              <label htmlFor='email'>Email Id</label>
            </div>
            <span className='error'>{errors.email?.message}</span>
            <div className='formInput'>
              <input type="password" id='password' placeholder=' '
                {...register("password")} />
              <label htmlFor='password'>Password</label>
            </div>
            <span className='error'>{errors.password?.message}</span>
            <div className='form-I-submit-button'>
              <button style={{ fontWeight: 'bold' }} type='submit'>
                Sign In
              </button>
            </div>
            <div className='google-sign'>
              <GoogleOAuthProvider clientId="768860655467-9tg7kt14g87md1356umvpri9lbron40f.apps.googleusercontent.com">
                <GoogleLogin
                  onSuccess={Success}
                  onError={Error}
                />
              </GoogleOAuthProvider>
            </div>
            <div style={{ paddingTop: '20px', fontSize: '13px' }}>
              <span>Don't you have an account?
                <Link to='/signup' style={{ textDecoration: 'underline' }}> Sign Up</Link>
              </span>
            </div>
          </form>
        </div>
      </div >
      <ToastContainer />
    </div >
  )
}

export default Login