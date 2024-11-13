<script lang="ts">
    import { StyleFromScheme } from "m3-svelte";
	import '../app.css';
	let { children } = $props();
</script>

<!-- https://ktibow.github.io/m3-svelte/theme; rgb(92, 157, 201) -->
 
<StyleFromScheme
  lightScheme={{"primary":4280640649,"onPrimary":4294967295,"primaryContainer":4291421951,"onPrimaryContainer":4278209646,"inversePrimary":4287942135,"secondary":4283392110,"onSecondary":4294967295,"secondaryContainer":4292077045,"onSecondaryContainer":4281878870,"tertiary":4284766588,"onTertiary":4294967295,"tertiaryContainer":4293582335,"onTertiaryContainer":4283187555,"error":4290386458,"onError":4294967295,"errorContainer":4294957782,"onErrorContainer":4287823882,"background":4294441470,"onBackground":4279770144,"surface":4294441470,"onSurface":4279770144,"surfaceVariant":4292731882,"onSurfaceVariant":4282468173,"inverseSurface":4281151797,"inverseOnSurface":4293849590,"outline":4285626494,"outlineVariant":4290889678,"shadow":4278190080,"scrim":4278190080,"surfaceDim":4292336351,"surfaceBright":4294441470,"surfaceContainerLowest":4294967295,"surfaceContainerLow":4294046969,"surfaceContainer":4293652211,"surfaceContainerHigh":4293257453,"surfaceContainerHighest":4292862952,"surfaceTint":4280640649}}
  darkScheme={{"primary":4287942135,"onPrimary":4278203469,"primaryContainer":4278209646,"onPrimaryContainer":4291421951,"inversePrimary":4280640649,"secondary":4290234841,"onSecondary":4280365631,"secondaryContainer":4281878870,"onSecondaryContainer":4292077045,"tertiary":4291739880,"onTertiary":4281674571,"tertiaryContainer":4283187555,"onTertiaryContainer":4293582335,"error":4294948011,"onError":4285071365,"errorContainer":4287823882,"onErrorContainer":4294957782,"background":4279243799,"onBackground":4292862952,"surface":4279243799,"onSurface":4292862952,"surfaceVariant":4282468173,"onSurfaceVariant":4290889678,"inverseSurface":4292862952,"inverseOnSurface":4281151797,"outline":4287336856,"outlineVariant":4282468173,"shadow":4278190080,"scrim":4278190080,"surfaceDim":4279243799,"surfaceBright":4281678398,"surfaceContainerLowest":4278849298,"surfaceContainerLow":4279770144,"surfaceContainer":4280033316,"surfaceContainerHigh":4280691246,"surfaceContainerHighest":4281414969,"surfaceTint":4287942135}} />

{@render children()}
