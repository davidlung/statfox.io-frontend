<template>
    <div
         class="text-uppercase mb-4 text--secondary d-flex"
         :class="{[type]:true}">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'subtitle-2'
            }
        }
    }
</script>