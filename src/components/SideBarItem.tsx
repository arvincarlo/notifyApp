type MenuItem = {
  icon: React.ReactNode;
  label: string;
};

type MenuItemProps = {
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
};

const SideBarItem = ({ item, isActive, onClick }: MenuItemProps) => {
  return (
    <div
      className={`flex items-center gap-2 p-2  cursor-pointer ${
        isActive
          ? "bg-red-50 text-red-600 rounded-2xl"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      {item.icon}
      <span className="whitespace-nowrap">{item.label}</span>
    </div>
  );
};

export default SideBarItem;
