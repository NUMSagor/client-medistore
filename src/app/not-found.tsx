import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p className='mb-4'>Could not find requested resource</p>
      <Link href="/" className='bg-amber-500 rounded-2xl p-2'>Return Home</Link>
    </div>
  )
}