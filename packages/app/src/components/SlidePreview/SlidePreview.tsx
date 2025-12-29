import { PitchDeck, SlideLayout } from '@pitch/types/pitch.types';
import { FC } from 'react';

export const mapYamlToSlides = (data: PitchDeck): SlideLayout[] => [
	{
		kicker: 'Product',
		title: data.title.product,
		blocks: [
			{ type: 'subtitle', text: data.title.tagline },
			{ type: 'text', text: data.title.audience },
		],
	},
	{
		kicker: 'Problem',
		title: 'Problem',
		blocks: [{ type: 'bullets', items: data.problem }],
	},
	{
		kicker: 'Solution',
		title: 'Solution',
		blocks: [{ type: 'text', text: data.solution.description }],
	},
	{
		kicker: 'Product',
		title: 'Product',
		blocks: [{ type: 'bullets', items: data.product.features }],
	},
	{
		kicker: 'Business Model',
		title: 'Pricing',
		blocks: [
			{
				type: 'highlight',
				left: data.businessModel.pricing,
				right: data.businessModel.model,
			},
		],
	},
];

export const SlidePreview: FC<{ slide: SlideLayout; index: number }> = ({
	slide,
	index,
}) => {
	return (
		<div
			className="group relative aspect-video h-[720px] w-[1280px] cursor-default border p-[56px] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
			style={{ borderColor: '#4B5563', backgroundColor: '#111827' }} // gray-700 / gray-900
		>
			{/* hover gradient overlay */}
			<div
				className="pointer-events-none absolute inset-0 opacity-5 transition-opacity group-hover:opacity-20"
				style={{
					background: 'linear-gradient(to bottom right, #8B5CF6, transparent)',
				}} // purple-500
			/>

			{/* slide index */}
			<div
				className="absolute top-[24px] right-[24px] font-mono text-[12px]"
				style={{
					color: '#9CA3AF',
					whiteSpace: 'normal',
					wordBreak: 'break-word',
				}} // gray-400
			>
				{index + 1} / 5
			</div>

			{/* kicker */}
			{slide.kicker && (
				<div
					className="mb-[16px] text-[12px] font-semibold uppercase"
					style={{
						color: '#A78BFA',
						whiteSpace: 'normal',
						wordBreak: 'break-word',
					}} // purple-400
				>
					{slide.kicker}
				</div>
			)}

			{/* deck title */}
			{slide.title && (
				<h2
					className="mb-[16px] text-[36px] font-bold"
					style={{
						color: '#FFFFFF',
						whiteSpace: 'normal',
						wordBreak: 'break-word',
					}}>
					{slide.title}
				</h2>
			)}

			<div className="flex flex-col gap-[24px]">
				{slide.blocks.map((b, i) => {
					const textStyle = {
						whiteSpace: 'normal' as const,
						wordBreak: 'break-word' as const,
					};
					switch (b.type) {
						case 'title':
							return (
								<h2
									key={i}
									className="text-[36px] font-bold"
									style={{ color: '#FFFFFF', ...textStyle }}>
									{b.text}
								</h2>
							);

						case 'subtitle':
							return (
								<div
									key={i}
									className="text-[24px] font-medium"
									style={{ color: '#D1D5DB', ...textStyle }}>
									<pre className="pb-2">{b.text}</pre>
								</div>
							);

						case 'text':
							return (
								<div
									key={i}
									className="max-w-[800px] text-[18px]"
									style={{ color: '#9CA3AF', ...textStyle }}>
									<pre className="pb-2">{b.text}</pre>
								</div>
							);

						case 'bullets':
							return (
								<ul
									key={i}
									className="space-y-[16px] pl-[24px] text-[18px]"
									style={{ color: '#E5E7EB', ...textStyle }}>
									{b.items.map((item, j) => (
										<li key={j} className="flex items-start gap-[16px]">
											<span style={{ color: '#A78BFA', marginTop: '4px' }}>
												●
											</span>
											<pre className="pb-2" style={textStyle}>
												{item}
											</pre>
										</li>
									))}
								</ul>
							);

						case 'highlight':
							return (
								<div
									key={i}
									className="flex items-center gap-[24px] rounded-[12px] p-[24px]"
									style={{ backgroundColor: '#1F2937' }}>
									<div
										className="text-[36px] font-extrabold"
										style={{ color: '#A78BFA', ...textStyle }}>
										<pre className="pb-2">{b.left}</pre>
									</div>
									<div
										className="text-[18px]"
										style={{ color: '#9CA3AF', ...textStyle }}>
										<pre className="pb-2">{b.right}</pre>
									</div>
								</div>
							);
					}
				})}
			</div>
		</div>
	);
};
