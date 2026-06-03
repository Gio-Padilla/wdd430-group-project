"use client"

import { useState } from "react"

type Review = {
    rating: number
    comment: string
}

export default function ReviewSection() {

    const [rating, setRating] = useState(0)

    const [comment, setComment] = useState("")

    const [reviews, setReviews] = useState<Review[]>([])

    function handleSubmit() {

        if (!rating || !comment) return

        const newReview = {
            rating,
            comment,
        }

        setReviews([...reviews, newReview])

        setRating(0)
        setComment("")
    }

    return (
        <section className="mt-12">

            <h2 className="text-2xl font-bold mb-6">
                Customer Reviews
            </h2>

            <div className="bg-gray-50 border rounded-2xl p-6 mb-8">

                <div className="flex gap-2 mb-4">

                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-3xl ${star <= rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                        >
                            ★
                        </button>
                    ))}

                </div>

                <textarea
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) =>
                        setComment(e.target.value)
                    }
                    className="w-full border rounded-lg p-4 mb-4 h-32 resize-none"
                />

                <button
                    onClick={handleSubmit}
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
                    Submit Review
                </button>

            </div>

            <div className="space-y-4">

                {reviews.length === 0 && (
                    <p className="text-gray-500">
                        No reviews yet.
                    </p>
                )}

                {reviews.map((review, index) => (
                    <div
                        key={index}
                        className="border rounded-xl p-4 bg-white"
                    >

                        <p className="text-yellow-500 text-xl mb-2">
                            {"★".repeat(review.rating)}
                        </p>

                        <p className="text-gray-700">
                            {review.comment}
                        </p>

                    </div>
                ))}

            </div>

        </section>
    )
}