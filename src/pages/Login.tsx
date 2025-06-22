import { useEffect, useState } from 'react';
import { auth } from '../utils/firestore';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const [validInputs, setValidInputs] = useState<{
    username: boolean;
    password: boolean;
  }>({ username: true, password: true });
  const { loginAsAdmin } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigate('/admin', { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (
      e.currentTarget.elements.namedItem('username') as HTMLInputElement
    ).value;
    const password = (
      e.currentTarget.elements.namedItem('password') as HTMLInputElement
    ).value;
    const [validUsername, validPassword] = validateInputs(username, password);
    setValidInputs({ username: validUsername, password: validPassword });

    try {
      if (!validUsername || !validPassword) {
        throw new Error('Invalid inputs');
      }
      loginAsAdmin(username, password);
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle error (e.g., show an error message)
    }
  };
  const validateInputs = (
    username: string,
    password: string
  ): [boolean, boolean] => {
    let validUsername = true;
    let validPassword = true;
    if (!username) {
      validUsername = false;
    }

    if (!password) {
      validPassword = false;
    }

    return [validUsername, validPassword];
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-blue2">
      <form
        className="text-center p-8 flex flex-col gap-[32px]"
        onSubmit={handleSubmit}
      >
        <h1 className="text-[40px] wv-ibmplex font-bold ">เข้าสู่ระบบ</h1>
        <div className="">
          <div
            className={`w-[364px] py-[16px] px-[20px] flex items-center bg-blue1 rounded-[10px] gap-[8px] ${
              validInputs.username ? '' : 'border-2 border-red-500'
            }`}
          >
            <img
              className="w-[18px] h-[18px]"
              src="/icon/profile.svg"
              alt="icon-profile"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="border-none outline-none flex-1 placeholder:text-[#1C1C1C]"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const passwordInput = document.querySelector(
                    'input[name="password"]'
                  ) as HTMLInputElement;
                  passwordInput?.focus();
                }
              }}
            />
          </div>
        </div>
        <div className="">
          <div
            className={`w-[364px] py-[16px] px-[20px] flex items-center bg-blue1 rounded-[10px] gap-[8px] ${
              validInputs.password ? '' : 'border-2 border-red-500'
            }`}
          >
            <img
              className="w-[18px] h-[18px]"
              src="/icon/lock.svg"
              alt="icon-lock"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border-none outline-none flex-1 placeholder:text-[#1C1C1C]"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-accent text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
