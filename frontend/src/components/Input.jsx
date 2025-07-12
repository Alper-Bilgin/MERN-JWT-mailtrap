// 'icon' prop'u Icon olarak yeniden adlandırılır ve diğer tüm props'lar (...props) input elemanına aktarılır
const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6">
      {/* 'pointer-events-none': Bu öğenin tıklanabilirliğini devre dışı bırakır (ikon tıklanmaz olur) */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-green-500" />
      </div>
      {/* {...props}: input'a dışarıdan gelen tüm props'lar aktarılır (örneğin type, placeholder, onChange vs.) */}
      <input
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400
        transition duration-200"
      />
    </div>
  );
};

export default Input;
