import React from 'react'

export default function LoginPage() {
  const login = (e) => {
    e.preventDefault();
    let user = document.getElementById('loginUsername').value
    let pass = document.getElementById('loginPassword').value

    console.log(user, pass )
  }
  return (
    <div>
       <form class="space-y-4">
                <div>
                    <label class="label">
                        <span class="text-base label-text">Username</span>
                    </label>
                    <input type="text" id="loginUsername" placeholder="Username" class="w-full input input-bordered input-primary" />
                </div>
                <div>
                    <label class="label">
                        <span class="text-base label-text">Password</span>
                    </label>
                    <input type="password" id="loginPassword" placeholder="Enter Password"
                        class="w-full input input-bordered input-primary" />
                </div>
                <div>
                    <button class="btn btn-block btn-primary" onClick={login}>Login</button>
                </div>
                <span>Don't have an account ?
                    <a href="#" class="text-blue-600 hover:text-blue-800 hover:underline">Signup</a></span>
            </form>
    </div>
  )
}
