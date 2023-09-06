import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import './Auth.css'
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import OTPInput, { ResendOTP } from "otp-input-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, storage } from '../components/FirebaseConfig'
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { HiArrowSmallRight } from 'react-icons/hi2'
import { MdOutlineAddAPhoto } from "react-icons/md"
import { ThreeDots } from 'react-loader-spinner'
import { MutatingDots } from 'react-loader-spinner'
import { v4 } from 'uuid'
import { registerUser, uniqueEmail } from '../services/apiCalls';
// HiArrowSmallRight


function SignIn() {


    const navigate = useNavigate()
    // const 
    const [userstatus,setUserStatus] = useState(false)
    const [alldone, setAlldone] = useState(false)
    const [verifyotpspinner, setVerifyOtpSpinner] = useState(false)
    const [url, setUrl] = useState('')
    const [sentotpspinner, setSentOtpSpinner] = useState(false)
    const [otpconfirmation, setOTPconfiremation] = useState('')
    const [signinstatus, setSigninstatus] = useState(false)
    const [otpstatus, setOTPstatus] = useState(false)
    const [OTP, setOTP] = useState("");
    const allowedCountry = ['in']

    const [formData,setFormData] = useState({})
    const [phone, setPhone] = useState('')
    const [verificaiton, setVerification] = useState(false)
    const [image, setImage] = useState('')
    const [preview, setPreview] = useState('')

    const setProfilePic = (e) => {
        setImage(e.target.files[0])
        // console.log(e.target.files[0]);
    }

    const schema = yup.object().shape({
        imagefile: yup.mixed().required('profile pic required')
            .test("empty", "profile pic required", (value) => {
                if (!value[0]) {
                    setPreview('https://i.postimg.cc/C1ZdC9LH/user.png')
                }
                return value[0]
            })
            .test("type", "supports only jpeg/jpg/png", (value) => {
                return value && (value[0] ? (value[0].type === "image/jpeg" | value[0].type === "image/jpg" | value[0].type === "image/png") : false)
            })
            .test("fileSize", "image size max 2mb", (value) => {
                return value && (value[0] ? value[0].size < 2000000 : false)
            }),
        username: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().min(6)
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {

        const {email} = data
        const uniqueResponse = await uniqueEmail({email})
        if(uniqueResponse.status === 210){
            console.log(uniqueResponse.data);
            toast.error(uniqueResponse.data)
        } else {
            console.log(data);
            setFormData(data)
            setVerification(true)
        }
        
    }

    const sendOTPNubmer = async () => {
        console.log(phone);

        if (phone && phone.slice(0, 2) !== "91") {
            // toast.error("Wrong country code, ony available in india(+91)")
            toast.error('Wrong country code, OTP allowed only in india(+91)', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,

                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else if (phone.length !== 12) {
            toast.error('(+91)+10 digits required', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,

                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            //enable spinner
            setSentOtpSpinner(true)
            //firebase mobile number verification call
            try {

                if (!window.recaptchaVerifier) {
                    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha', {
                        'size': 'invisible',
                        'callback': (response) => {
                            // reCAPTCHA solved, allow signInWithPhoneNumber.
                            //console.log(window.recaptchaVerifier);
                        }
                    })
                }
                //adding '+'
                let number = "+" + phone
                console.log(number);
                await signInWithPhoneNumber(auth, number, window.recaptchaVerifier)
                    .then((confirmationResult) => {
                        // SMS sent. Prompt user to type the code from the message, then sign the
                        // user in with confirmationResult.confirm(code).
                        // window.confirmationResult = confirmationResult;
                        // console.log(confirmationResult);
                        setOTPconfiremation(confirmationResult)

                        toast.success('OTP send to ' + phone)
                        setOTPstatus(true)
                        setSigninstatus(true)
                        setSentOtpSpinner(false)
                        // ...
                    }).catch(error => {
                        // Error; SMS not sent
                        // ...
                        //console.log(error);
                        toast('OTP not sent, re-check the number!')
                        setSentOtpSpinner(false)
                    });
            }
            catch (error) {
                //console.log(error);
                setSentOtpSpinner(false)
            }
            //toast.success("number"+phone)
        }
    }

    const verifyOTPcode = () => {
        //console.log('otp:'+OTP);

        if (OTP.length !== 6) {
            toast.error('6 digit OTP required')
        } else {
            setVerifyOtpSpinner(true)
            otpconfirmation.confirm(OTP).then((result) => {
                // User signed in successfully.
                const user = result.user;
                console.log(user);
                uploadImageToFirebase()
                // ...
            }).catch((error) => {
                // User couldn't sign in (bad verification code?)
                // ...
                toast.error('Wrong OTP!')
                setVerifyOtpSpinner(false)
                console.log(error);
            });
        }
    }

    const uploadImageToFirebase = async () => {
        const uniquename = v4().slice(0, 4) + image.name
        console.log(uniquename);
        const imageRef = ref(storage, `users/${uniquename}`);
        await uploadBytes(imageRef, image)
            .then(() => {
                //alert('uploaded')
                getDownloadURL(imageRef)
                    .then(url => {
                        setUrl(url)
                        //console.log(url);
                        setVerifyOtpSpinner(false)
                        setVerification(false)
                        setAlldone(true)
                        toast.success(`Your number ${phone}, verified!`,{
                            autoClose:1500
                        })
                    }).catch(error => {
                        console.log(error);
                        setVerifyOtpSpinner(false)
                        //alert('error')
                    })
            }).catch((error) => {
                console.log(error);
                //alert('error')
                setVerifyOtpSpinner(false)
            })
    }

    const SignInUser = async () =>{
        setUserStatus(true)
        const tempObj = {...formData,url,mobile:phone}
        const {imagefile, ...body} = tempObj
        console.log(body);
        const registerResponse = await registerUser(body)
        if(registerResponse.status === 200){
            toast.success('sign in successful!, Log In with gmail & password',{
                autoClose: 2500
            })
            setTimeout(()=>{
                navigate("/")    
            },3000)
        } else {
            console.log(registerResponse);
            toast.error('error on creating account!, try google login')
        }
    }





    useEffect(() => {
        if (image) {
            setPreview(URL.createObjectURL(image))
        }

    }, [image, verificaiton])

    return (
        <div className='signinContainer'>
            {/* header css from Home.css */}
            <div className='s_tag'>
                <img src="https://i.postimg.cc/wjjTDwgj/chat.png" alt="" />
                <h3>MeChat</h3>
            </div>
            {/* body */}
            <div className='signin'>
                <div className='signin_body'>
                    <div className='singinImage'>
                        <img src="https://i.postimg.cc/wjjTDwgj/chat.png" alt="" />
                        <h2>MeChat</h2>
                        <p>Let's chit chat on MeChat!</p>
                        <span>We recommend signing in with mobile number to easily connect with friends.</span>
                    </div>
                    {/* sign in part I */}
                    {(!verificaiton && !alldone) &&
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h2>Sign In</h2>
                            <div type='file' className='imgContainer'>
                                <input type="file" id='image'
                                    {...register('imagefile')} onChangeCapture={setProfilePic} />
                                {/* onChange={setProfilePic} */}
                                <img className='form-img' src={preview ? preview : "https://i.postimg.cc/C1ZdC9LH/user.png"} alt="" />
                                <label htmlFor='image' className='choose' style={preview ? { opacity: '0' } : { opacity: '1' }}>
                                    <h1><MdOutlineAddAPhoto /></h1>
                                </label>
                            </div>
                            <span className='image-error'>{errors.imagefile?.message}</span>
                            <div className='formInput'>
                                <input type="text" id='username' placeholder=' '
                                    {...register("username")} />
                                <label htmlFor='username'>Username</label>
                            </div>
                            <span className='error'>{errors.username?.message}</span>
                            <div className='formInput'>
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
                                    Continue 
                                    <HiArrowSmallRight />
                                </button>
                            </div>
                        </form>
                    }
                    {/* sing in part II */}
                    {verificaiton &&
                        <div className='form-II'>
                            <h2>Verification</h2>
                            <div>
                                <PhoneInput
                                    disableSearchIcon
                                    disableDropdown
                                    onlyCountries={allowedCountry}
                                    inputStyle={{ borderRadius: "10px", width: "100%", borderWidth: "2px" }}
                                    buttonStyle={{ borderRadius: "10px", border: "none", backgroundColor: "transparent" }}
                                    country={'in'}
                                    value={phone}
                                    onChange={setPhone}
                                />
                                <div>
                                    {!otpstatus &&
                                        <button onClick={sendOTPNubmer} className='send-otp'>
                                            Send OTP
                                            {sentotpspinner &&
                                                <ThreeDots
                                                    height="20"
                                                    width="30"
                                                    radius="9"
                                                    color="#FFF"
                                                    ariaLabel="three-dots-loading"
                                                    wrapperStyle={{}}
                                                    wrapperClassName=""
                                                    visible={true}
                                                />
                                            }
                                        </button>
                                    }
                                </div>
                                {otpstatus &&
                                    <>
                                        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                                            <span>Type OTP digits here:</span>
                                            <OTPInput
                                                inputStyles={{ marginRight: "11px" }}
                                                value={OTP}
                                                onChange={setOTP}
                                                OTPLength={6}
                                                otpType="number"
                                                disabled={false} secure />
                                        </div>
                                        <div>
                                            <ResendOTP
                                                onResendClick={sendOTPNubmer}
                                                className="resend-otp"
                                                maxTime={120}
                                                renderTime={false} />

                                        </div>
                                    </>
                                }
                                {signinstatus &&
                                    <div>
                                        <button onClick={verifyOTPcode} className='verify-btn'>
                                            Verify OTP
                                            {verifyotpspinner &&
                                                <ThreeDots
                                                    height="20"
                                                    width="30"
                                                    radius="9"
                                                    color="#FFF"
                                                    ariaLabel="three-dots-loading"
                                                    wrapperStyle={{}}
                                                    wrapperClassName=""
                                                    visible={true}
                                                />
                                            }
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    {alldone &&
                        <div className='form-III'>
                            { userstatus &&
                                <MutatingDots
                                height="100"
                                width="100"
                                color="#1db4f5e4"
                                secondaryColor='#4fa94d'
                                radius='12.5'
                                ariaLabel="mutating-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                            />
                            }
                            <h2>All Done!</h2>
                            <button onClick={SignInUser} className='Sign-in'>Sign In</button>
                        </div>
                    }
                </div>

            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div id='recaptcha'></div>
        </div>

    )
}

export default SignIn