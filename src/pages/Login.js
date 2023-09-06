import React from 'react'
import './Auth.css'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { GoogleSignInUser, loginUser } from '../services/apiCalls'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

//to read the data
import { useDispatch } from 'react-redux'
import { setUser } from '../features/slice'

function Login() {

  //const myUser = useSelector(state => state.activeUser)
  const dispatch = useDispatch()
  
  //dispatch(setUser({name:'johny'}))


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
      sessionStorage.setItem('userInfo',JSON.stringify(loginResponse.data))
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
    const {email,name,picture} = jwt_decode(data.credential)
    //console.log(email,name,picture);
    const body = {
      username:name,
      email,
      password:"#23Gsin",
      url:picture,
      mobile:"#45Gauth"
    }
    //console.log(body);
    const googleSignInResponse = await GoogleSignInUser(body)
    //console.log(googleSignInResponse);
    if(googleSignInResponse.status === 200){
      sessionStorage.setItem('userInfo',JSON.stringify(googleSignInResponse.data))
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
    <div className='loginContainer'>
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
            <span>We recommend signing in with mobile number to easily connect with friends.</span>
          </div>
          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className='loginForm'>
            <h2>Sign In</h2>

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
              <button type='submit'>
                Log In
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
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login