type Props = {
    children: React.ReactNode
    className?: string
}

export default function Badge({
    children,
    className = "",
}: Props) {
    return (
        <span
            className={`inline-block bg-[#2F4F4F] text-white px-3 py-1 rounded-full text-sm font-medium ${className}`}
        >
            {children}
        </span>
    )
}