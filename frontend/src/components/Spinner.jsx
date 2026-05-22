export default function Spinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <div className="w-9 h-9 border-[3px] border-gray-100 border-t-brand-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  )
}