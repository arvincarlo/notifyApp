export const RadioButton = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 p-0.5 cursor-pointer inline-flex items-center justify-center
          ${checked ? "border-[#FF4647]" : "border-gray-300"}`}
      onClick={onChange}
    >
      {checked && <div className="w-3 h-3 rounded-full bg-[#FF4647]" />}
    </div>
  );
};
