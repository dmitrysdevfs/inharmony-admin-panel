import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/auth/login');
}

// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';

// export default function Home() {
//   const token = cookies().get('accessToken');

//   if (!token) {
//     redirect('/auth/login');
//   }

//   redirect('/dashboard');
// }
