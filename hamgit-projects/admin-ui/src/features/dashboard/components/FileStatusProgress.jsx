export const FileStatusProgress = ({ fileStatus }) => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-zinc-200">
      <div className="flex justify-between items-center pb-4 mb-8 border-b border-zinc-200">
        <h3 className="text-zinc-900 text-xl font-medium">تعداد فایل‌ها به تفکیک وضعیت</h3>
        <div className="flex items-center gap-4 text-neutral-400 text-sm fa">
          <div>
            انصراف: <span className="text-stone-900">{fileStatus?.CANCELLED}</span>
          </div>
          <div>
            بایگانی: <span className="text-stone-900">{fileStatus?.ARCHIVED}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center relative">
          {[
            { number: fileStatus?.FILE_CREATED, label: 'ثبت لید' },
            { number: fileStatus?.INFO_COMPLETED, label: 'ثبت اطلاعات' },
            { number: fileStatus?.AD_REGISTERED, label: 'ثبت آگهی' },
            { number: fileStatus?.FILE_SEARCH, label: 'تطبیق' },
            { number: fileStatus?.NEGOTIATION, label: 'مذاکره' },
            { number: fileStatus?.VISIT, label: 'بازدید' },
            { number: fileStatus?.CONTRACT_SIGNED, label: 'قرارداد' },
          ].map((step, index, arr) => (
            <div key={index} className="flex flex-1 flex-col items-center relative">
              <div className="size-12 rounded-full border-2 border-violet-400 bg-white flex items-center justify-center text-purple-800 font-medium text-lg z-10 fa">
                {step.number}
              </div>
              <div className="mt-2 text-center text-sm text-neutral-700 font-medium">
                {step.label}
              </div>
              {index !== arr.length - 1 && (
                <div className="absolute top-6 right-2/3 w-2/3 h-0.5 bg-purple-800 z-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
