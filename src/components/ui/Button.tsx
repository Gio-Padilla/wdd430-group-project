type Props = {
    children: React.ReactNode
    onClick?: () => void
}

export default function Button({
    children,
    onClick,
}: Props) {
    return (
        <button
            onClick={onClick}
            className="
              rounded-lg
              border-2
              border-black
              bg-[#2F4F4F]
              px-4
              py-2
              text-sm
              font-bold
              text-white
              transition
              hover:bg-[#F26419]
              hover:shadow-md
            "
        >
            {children}
        </button>
    )
}