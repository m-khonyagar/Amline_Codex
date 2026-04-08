function WrapperCard({ children, error }) {
  return (
    <div
      className={`bg-background rounded-2xl p-4 shadow-xl ${error ? 'border border-rust-600' : ''}`}
    >
      {children}
    </div>
  )
}

export default WrapperCard
