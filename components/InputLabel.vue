<template>
    <div class="d-flex text-body-2 pb-1 pt-3 text--secondary font-weight-bold">
        <div class="text-uppercase"><small><slot/></small> <span v-if="$attrs.required" class="red--text">*</span></div>
        <v-spacer></v-spacer>
        <div><small><slot name="append"/></small></div>
    </div>
</template>