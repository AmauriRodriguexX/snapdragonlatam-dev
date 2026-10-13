<script lang="ts">
	import { page } from '$app/state';
	import { SITE, type SeoProps } from '#lib/site';

	let { title, description, image = SITE.defaultImage }: SeoProps = $props();

	let fullTitle = $derived(`${title} | ${SITE.name}`);
	let canonicalUrl = $derived(`${SITE.url}${page.url.pathname.replace(/\/$/, '')}`);
	let fullImageUrl = $derived(image.startsWith('http') ? image : `${SITE.url}${image}`);

	const schemaOrg = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: fullTitle,
			description: description,
			url: canonicalUrl,
			inLanguage: 'es-419',
			publisher: {
				'@type': 'Organization',
				name: 'Qualcomm Snapdragon Latinoamérica',
				url: SITE.url,
				logo: `${SITE.url}/media/brand/logo-snapdragon-red.svg`
			}
		})
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- OpenGraph -->
	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={fullImageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="es_LA" />

	<!-- Twitter Cards -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@snapdragon_LAT" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={fullImageUrl} />

	<!-- Schema.org JSON-LD -->
	{@html `<script type="application/ld+json">${schemaOrg}</script>`}
</svelte:head>
