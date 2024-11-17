<script lang="ts">
    import { StyleFromScheme } from "m3-svelte";
	import '../app.css';
	let { children } = $props();
</script>

<!-- https://ktibow.github.io/m3-svelte/theme; rgb(92, 157, 201) -->

<StyleFromScheme
  lightScheme={{"primary":4283587218,"onPrimary":4294967295,"primaryContainer":4292862207,"onPrimaryContainer":4282073721,"inversePrimary":4290495487,"secondary":4284177778,"onSecondary":4294967295,"secondaryContainer":4292927993,"onSecondaryContainer":4282598745,"tertiary":4286010220,"onTertiary":4294967295,"tertiaryContainer":4294957040,"onTertiaryContainer":4284300372,"error":4290386458,"onError":4294967295,"errorContainer":4294957782,"onErrorContainer":4287823882,"background":4294703359,"onBackground":4279966497,"surface":4294703359,"onSurface":4279966497,"surfaceVariant":4293124588,"onSurfaceVariant":4282795599,"inverseSurface":4281348150,"inverseOnSurface":4294111223,"outline":4286019200,"outlineVariant":4291282384,"shadow":4278190080,"scrim":4278190080,"surfaceDim":4292598240,"surfaceBright":4294703359,"surfaceContainerLowest":4294967295,"surfaceContainerLow":4294308602,"surfaceContainer":4293914100,"surfaceContainerHigh":4293519343,"surfaceContainerHighest":4293190121,"surfaceTint":4283587218}}
  darkScheme={{"primary":4290495487,"onPrimary":4280560737,"primaryContainer":4282073721,"onPrimaryContainer":4292862207,"inversePrimary":4283587218,"secondary":4291085789,"onSecondary":4281151298,"secondaryContainer":4282598745,"onSecondaryContainer":4292927993,"tertiary":4293311191,"onTertiary":4282721853,"tertiaryContainer":4284300372,"onTertiaryContainer":4294957040,"error":4294948011,"onError":4285071365,"errorContainer":4287823882,"onErrorContainer":4294957782,"background":4279440152,"onBackground":4293190121,"surface":4279440152,"onSurface":4293190121,"surfaceVariant":4282795599,"onSurfaceVariant":4291282384,"inverseSurface":4293190121,"inverseOnSurface":4281348150,"outline":4287664282,"outlineVariant":4282795599,"shadow":4278190080,"scrim":4278190080,"surfaceDim":4279440152,"surfaceBright":4281940287,"surfaceContainerLowest":4279045651,"surfaceContainerLow":4279966497,"surfaceContainer":4280229669,"surfaceContainerHigh":4280887599,"surfaceContainerHighest":4281611322,"surfaceTint":4290495487}} />


{@render children()}
