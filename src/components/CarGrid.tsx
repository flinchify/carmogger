'use client';

import Image from 'next/image';
import Link from 'next/link';


export default function CarGrid() {
  const cars = [].slice(0, 4);

  return (
    <div className="rounded-[20px] p-6"
      style={{ background: '#0f1420', border: '1px solid rgba(148,163,184,0.08)' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-[#f0f2f5]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          My Cars
        </h2>
        <Link href="/dashboard/cars" className="text-xs font-medium text-[#3b82f6] hover:underline">
          View all
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {/* Upload card */}
        <Link href="/rate"
          className="flex-shrink-0 w-[180px] h-[220px] rounded-2xl flex flex-col items-center justify-center gap-3 transition-all hover:border-[#3b82f6]"
          style={{ border: '2px dashed rgba(148,163,184,0.15)', background: 'rgba(15,20,32,0.5)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span className="text-xs font-medium text-[#64748b]">Add New Car</span>
        </Link>

        {/* Car cards */}
        {cars.map((car, i) => (
          <div key={car.id}
            className="flex-shrink-0 w-[180px] rounded-2xl overflow-hidden transition-all hover-lift"
            style={{ background: '#141a28', border: '1px solid rgba(148,163,184,0.06)' }}>
            <div className="relative h-[130px]">
              <Image
                src={car.imageUrl}
                alt={car.carName}
                fill
                className="object-cover"
                sizes="180px"
              />
              {/* Score badge */}
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(6,8,13,0.8)', backdropFilter: 'blur(8px)', color: '#f0f2f5' }}>
                {car.score}
              </div>
              {/* Pinned indicator for first card */}
              {i === 0 && (
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                  style={{ background: 'rgba(59,130,246,0.9)', color: '#fff' }}>
                  Featured
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-[#f0f2f5] truncate">{car.carName}</p>
              <p className="text-[10px] text-[#64748b] mt-1">Updated 2d ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
