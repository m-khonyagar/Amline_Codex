import Link from 'next/link'

function ContractNotFound() {
  return (
    <div className="my-auto flex flex-col gap-5 justify-center items-center">
      <h4 className="text-lg">قرارداد یافت نشد!!</h4>
      <Link href="/" className="text-primary underline">
        صفحه اصلی
      </Link>
    </div>
  )
}

export default ContractNotFound
