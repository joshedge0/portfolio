<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { gsap } from 'gsap';

	// ============================================
	// COMPONENT STATE
	// ============================================

	let isLoading = $state(true);
	let animationComplete = $state(false);

	// ============================================
	// DOM REFERENCES (using bind:this)
	// ============================================

	let header: HTMLDivElement;
	let letters: HTMLSpanElement[] = [];
	let box: HTMLDivElement;
	let growingImage: HTMLDivElement;
	let titleStart: HTMLDivElement;
	let titleEnd: HTMLDivElement;
	let coverImageExtras: HTMLImageElement[] = [];
	let coverImage: HTMLImageElement;
	let mainContent: HTMLElement;
	let contentCards: HTMLElement[] = [];

	// ============================================
	// PORTFOLIO DATA
	// ============================================

	interface Experience {
		company: string;
		role: string;
		period: string;
		responsibilities: string[];
	}

	interface Education {
		institution: string;
		degree: string;
		completion: string;
		specialization?: string;
	}

	interface SkillCategory {
		category: string;
		skills: string;
	}

	const experiences: Experience[] = [
		{
			company: 'Ricoh Canada',
			role: 'Architect, Software Development',
			period: '2022 - Present',
			responsibilities: [
				'Develop custom enterprise solutions for client document management and workflow automation systems through iterative design and client collaboration',
				'Integrate with third-party APIs to connect external platforms and enable cross-system data exchange',
				'Customize web forms and user interfaces using HTML, CSS, and JavaScript, implementing custom logic and validation',
				'Configure and deploy client infrastructure, working with various technologies as project requirements dictate, be that on-premise or cloud based',
				'Deliver end-to-end technical solutions from requirements gathering through deployment and client handoff'
			]
		},
		{
			company: 'Gennix Consulting Inc',
			role: 'Junior Field Technician',
			period: '2018 - 2022',
			responsibilities: [
				'Configured and deployed IT infrastructure for clients, troubleshooting technical issues onsite and remotely',
				'Maintained documentation and ticketing workflows for service requests'
			]
		}
	];

	const education: Education[] = [
		{
			institution: 'Georgia Institute of Technology',
			degree: 'Master of Science in Computer Science',
			completion: 'Expected Completion 2027',
			specialization: 'Artificial Intelligence'
		},
		{
			institution: 'University of the Fraser Valley',
			degree: 'Bachelor of Science in Computing Science',
			completion: 'Completed 2022'
		}
	];

	const skills: SkillCategory[] = [
		{ category: 'Languages', skills: 'TypeScript/JavaScript, Python, Go, Java' },
		{
			category: 'Frontend',
			skills: 'React, Next.js, Svelte/SvelteKit, Tailwind CSS'
		},
		{
			category: 'Backend',
			skills: 'API Design, Auth Integration, DB Design, Prisma/ORMs'
		},
		{
			category: 'DevOps',
			skills: 'Cloud Hosting, Docker, CI/CD, GitHub Actions, Linux'
		}
	];

	let expandedExperiences = $state<Set<number>>(new Set());

	function toggleExperience(index: number) {
		if (expandedExperiences.has(index)) {
			expandedExperiences.delete(index);
		} else {
			expandedExperiences.add(index);
		}
		expandedExperiences = new Set(expandedExperiences); // trigger reactivity
	}

	// ============================================
	// ANIMATION INITIALIZATION
	// ============================================

	function initLoadingAnimation() {
		if (coverImage.complete && coverImage.naturalWidth > 0) {
			startAnimation();
		} else {
			coverImage.onload = () => {
				startAnimation();
			};
		}
	}

	function startAnimation() {
		const tl = gsap.timeline({
			defaults: { ease: 'expo.inOut' },
			onStart: () => {
				header.classList.remove('hidden');
				isLoading = true;
			},
			onComplete: () => {
				isLoading = false;
				animationComplete = true;
			}
		});

		// Phase 1: Letters animate in
		tl.from(letters.filter(Boolean), {
			yPercent: 100,
			stagger: 0.025,
			duration: 1.25
		});

		// Phase 2: Box expands
		tl.fromTo(box, { width: '0em' }, { width: '1.8em', duration: 1.25 }, '< 1.25');
		tl.fromTo(growingImage, { width: '0%' }, { width: '100%', duration: 1.25 }, '<');
		tl.fromTo(titleStart, { x: '0em' }, { x: '-0.05em', duration: 1.25 }, '<');
		tl.fromTo(titleEnd, { x: '0em' }, { x: '0.05em', duration: 1.25 }, '<');

		// Phase 3: Image cycling
		tl.fromTo(
			coverImageExtras.filter(Boolean),
			{ opacity: 1 },
			{ opacity: 0, duration: 0.05, ease: 'none', stagger: 0.5 },
			'-=0.05'
		);

		// Phase 4: Slide title and image up and out
		tl.to(box, { y: -800, duration: 2 }, '<+1');
		tl.to([titleStart, titleEnd], { y: -800, duration: 2 }, '<');
		tl.to(
			header,
			{
				opacity: 0,
				duration: 0.05,
				onComplete: () => {
					header.classList.add('hidden');
				}
			},
			'>-1'
		);

		// Phase 5: Slide content up from below
		tl.fromTo(
			mainContent,
			{ y: '100vh', opacity: 1 },
			{ y: 0, duration: 1, ease: 'expo.out' },
			'<'
		);
		tl.fromTo(
			contentCards.filter(Boolean),
			{ y: 100, opacity: 0 },
			{ y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.15 },
			'<+0.3'
		);
	}

	// ============================================
	// LIFECYCLE HOOKS
	// ============================================

	onMount(() => {
		initLoadingAnimation();
	});

	// Letter arrays for iteration
	const nameStart = ['J', 'o', 's', 'h'];
	const nameEnd = ['E', 'd', 'g', 'e'];
</script>

<svelte:head>
	<title>Josh Edge - Software Developer</title>
</svelte:head>

<div
	class="h-full w-full bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[length:40px_40px]"
>
	<!-- Loading Animation Container -->
	<div bind:this={header} class="fixed top-0 left-0 z-[1000] hidden h-dvh w-full overflow-hidden">
		<div class="loader absolute top-0 left-0 flex h-full w-full items-start justify-center overflow-hidden pt-56 text-[#201d1d]">
			<div class="title relative flex justify-center whitespace-nowrap text-[clamp(4rem,12.5vw,12.5rem)] font-medium leading-[1.5]">
				<div bind:this={titleStart} class="flex w-[3em] justify-end overflow-hidden">
					{#each nameStart as letter, i}
						<span bind:this={letters[i]} class="relative block">{letter}</span>
					{/each}
				</div>
				<div bind:this={box} class="relative flex w-0 flex-col items-center justify-center">
					<div class="relative flex h-[95%] min-w-[1.8em] items-center justify-center">
						<div bind:this={growingImage} class="absolute flex h-[80%] w-0 items-center justify-center overflow-hidden">
							<div class="absolute h-full w-full min-w-[1.8em]">
								<img
									bind:this={coverImageExtras[0]}
									class="pointer-events-none absolute top-0 left-0 z-[3] h-full w-full select-none object-cover"
									src="/src/lib/assets/images/sunset.avif"
									loading="eager"
									alt="Sunset"
								/>
								<img
									bind:this={coverImageExtras[1]}
									class="pointer-events-none absolute top-0 left-0 z-[2] h-full w-full select-none object-cover"
									src="/src/lib/assets/images/beach.avif"
									loading="eager"
									alt="Beach"
								/>
								<img
									bind:this={coverImageExtras[2]}
									class="pointer-events-none absolute top-0 left-0 z-[1] h-full w-full select-none object-cover"
									src="/src/lib/assets/images/jeep.avif"
									loading="eager"
									alt="Jeep"
								/>
								<img
									bind:this={coverImage}
									class="pointer-events-none absolute top-0 left-0 h-full w-full select-none object-cover"
									src="/src/lib/assets/images/heads.avif"
									loading="eager"
									alt="Mountains"
									crossorigin="anonymous"
								/>
							</div>
						</div>
					</div>
				</div>
				<div bind:this={titleEnd} class="flex w-[3em] justify-start overflow-hidden">
					{#each nameEnd as letter, i}
						<span bind:this={letters[i + 4]} class="relative block">{letter}</span>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<main bind:this={mainContent} class="relative z-[1] min-h-screen opacity-100">
		<div class="mx-auto max-w-4xl px-6 py-16 max-md:px-4 max-md:py-8">
			<!-- Header -->
			<header
				bind:this={contentCards[0]}
				class="mb-8 flex justify-between rounded-lg bg-[#f9f9f9] px-6 pt-6 pb-8 opacity-0 shadow-md"
			>
				<div>
					<h1 class="mb-2 text-5xl font-bold text-slate-900 max-md:text-4xl">Josh Edge</h1>
					<p class="text-xl text-[#475569]">Software Developer</p>
				</div>
				<div class="flex flex-col justify-end gap-1 p-2">
					<a
						href="https://github.com/joshedge0"
						target="_blank"
						rel="noopener noreferrer"
						class="group flex items-center gap-2 pb-2 text-slate-700 no-underline"
					>
						<svg class="h-5 w-5 transition-colors duration-200 group-hover:text-[#4b6629]" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
							/>
						</svg>
						<span class="transition-colors duration-200 group-hover:text-[#4b6629]">GitHub</span>
					</a>
					<a
						href="https://www.linkedin.com/in/josh-edge-940980203"
						target="_blank"
						rel="noopener noreferrer"
						class="group flex items-center gap-2 text-slate-700 no-underline"
					>
						<svg class="h-5 w-5 transition-colors duration-200 group-hover:text-[#4b6629]" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
							/>
						</svg>
						<span class="transition-colors duration-200 group-hover:text-[#4b6629]">LinkedIn</span>
					</a>
				</div>
			</header>

			<!-- Experience Section -->
			<section bind:this={contentCards[1]} class="mb-8 translate-y-10 rounded-lg bg-[#f9f9f9] p-6 opacity-0 shadow-md transition-shadow duration-200 hover:shadow-lg">
				<h2 class="mb-6 border-b-2 border-[#5c7837] pb-2 text-3xl font-bold text-slate-900">Experience</h2>
				{#each experiences as exp, i}
					<div class={i < experiences.length - 1 ? 'mb-6' : ''}>
						<button
							type="button"
							onclick={() => toggleExperience(i)}
							class="mb-3 flex w-full cursor-pointer flex-col rounded-l py-1 px-4 text-left transition-colors hover:bg-[#f4f7f0] sm:flex-row sm:items-start sm:justify-between"
						>
							<div>
								<h3 class="text-xl font-semibold text-slate-900">{exp.company}</h3>
								<p class="flex items-center gap-2 text-lg text-[#5c7837]">
									{exp.role}
									<svg
										class="h-4 w-4 transition-transform duration-200 {expandedExperiences.has(i)
											? 'rotate-180'
											: ''}"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</p>
							</div>
							<span class="mt-1 text-sm text-slate-600 sm:mt-0 sm:text-base">{exp.period}</span>
						</button>

						{#if expandedExperiences.has(i)}
							<ul transition:slide={{ duration: 200 }} class="m-0 list-none p-0">
								{#each exp.responsibilities as responsibility}
									<li
										class="mb-2 pr-1.5 pl-5 leading-relaxed text-slate-700"
									>
										{responsibility}
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</section>

			<!-- Projects Section -->
			<section bind:this={contentCards[2]} class="mb-8 translate-y-10 rounded-lg bg-[#f9f9f9] p-6 opacity-0 shadow-md transition-shadow duration-200 hover:shadow-lg">
				<h2 class="mb-6 border-b-2 border-[#5c7837] pb-2 text-3xl font-bold text-slate-900">Projects</h2>

				<a
					href="https://webme.joshedge.ca"
					target="_blank"
					rel="noopener noreferrer"
					class="group block cursor-pointer rounded-lg px-4 pb-4 transition-colors hover:bg-[#f4f7f0]"
				>
					<h3 class="text-xl font-semibold text-slate-900 transition-colors">
						webMe
					</h3>
					<p class="mb-2 text-lg text-[#5c7837]">Drag and drop website builder</p>

					<div class="mt-3 flex flex-wrap gap-2">
						{#each ['CI/CD', 'Github Actions', 'Containerized', 'Self Hosted', 'OAuth Integrations'] as tag}
							<span class="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700">{tag}</span>
						{/each}
					</div>

					<div class="mt-2 flex flex-wrap gap-2">
						{#each ['Next.js', 'React', 'Tailwind', 'Prisma', 'Postgres'] as tech}
							<span class="rounded-full bg-[#e2e8da] px-2 py-1 text-xs text-[#5c7837]">{tech}</span>
						{/each}
					</div>
				</a>
			</section>

			<!-- Technical Skills Section -->
			<section bind:this={contentCards[3]} class="mb-8 translate-y-10 rounded-lg bg-[#f9f9f9] p-6 opacity-0 shadow-md transition-shadow duration-200 hover:shadow-lg">
				<h2 class="mb-6 border-b-2 border-[#5c7837] pb-2 text-3xl font-bold text-slate-900">Technical Skills</h2>
				<div class="grid gap-4">
					{#each skills as skill}
						<div class="px-4 text-slate-700">
							<span class="font-semibold text-slate-900">{skill.category}:</span>
							<span class="ml-2">{skill.skills}</span>
						</div>
					{/each}
				</div>
			</section>

			<!-- Education Section -->
			<section bind:this={contentCards[4]} class="mb-8 translate-y-10 rounded-lg bg-[#f9f9f9] p-6 opacity-0 shadow-md transition-shadow duration-200 hover:shadow-lg">
				<h2 class="mb-6 border-b-2 border-[#5c7837] pb-2 text-3xl font-bold text-slate-900">Education</h2>
				{#each education as edu, i}
					<div class={i < education.length - 1 ? 'mb-6' : ''}>
						<div class="flex flex-col px-4 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<h3 class="text-xl font-semibold text-slate-900">{edu.institution}</h3>
								<p class="text-lg text-[#5c7837]">{edu.degree}</p>
								{#if edu.specialization}
									<p class="italic text-slate-600">Specialization: {edu.specialization}</p>
								{/if}
							</div>
							<span class="mt-1 text-sm text-slate-600 sm:mt-0 sm:text-base">{edu.completion}</span>
						</div>
					</div>
				{/each}
			</section>
		</div>
	</main>
</div>