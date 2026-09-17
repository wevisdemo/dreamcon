import { useEffect, useState } from 'react';
import LockIcon from '@material-symbols/svg-700/rounded/lock.svg?react';
import { useNavigate } from 'react-router-dom';
import ProfileIcon from '../components/icon/ProfileIcon';
import useAuth from '../hooks/useAuth';
import { auth } from '../utils/firestore';

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

    if (!validUsername || !validPassword) return;

    try {
      await loginAsAdmin(username, password);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบ Username และ Password');
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
    <div className="flex h-screen w-screen items-center justify-center bg-blue-2">
      <form
        className="flex flex-col gap-8 p-8 text-center"
        onSubmit={handleSubmit}
      >
        <h1 className="wv-ibmplex heading-2 font-bold">เข้าสู่ระบบ</h1>
        <div className="">
          <div
            className={`flex w-91 items-center gap-2 rounded-[10px] bg-blue-1 px-5 py-4 ${
              validInputs.username ? '' : 'border-2 border-red-5'
            }`}
          >
            <ProfileIcon className="h-4.5 w-4.5 text-[#1C1C1C]" aria-hidden />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="flex-1 border-none outline-none placeholder:text-[#1C1C1C]"
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
            className={`flex w-91 items-center gap-2 rounded-[10px] bg-blue-1 px-5 py-4 ${
              validInputs.password ? '' : 'border-2 border-red-5'
            }`}
          >
            <LockIcon className="h-4.5 w-4.5 text-[#1C1C1C]" aria-hidden />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="flex-1 border-none outline-none placeholder:text-[#1C1C1C]"
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-md bg-blue-6 px-6 py-2 font-bold text-white hover:bg-blue-7"
        >
          Login
        </button>
      </form>
    </div>
  );
}
