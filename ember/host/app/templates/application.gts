import HostCounter from '../components/counter.gts'
import { load } from 'ember-async-data'
import { modifier } from 'ember-modifier'

const loadRemote = async () => (await import('remote/mount').then(remote => remote.__mf_remote_pending))
const mount = modifier((el: HTMLElement, [mountFn]: [(el: HTMLElement) => void | (() => void)]) => {
  return mountFn(el)
})

<template>
  <div class='host'>
    <div class='card'>
      <div class='icon'>
        <svg viewBox='0 0 512 512' aria-hidden='true'>
          <path d='M316.01,199.02L256.134,14.817L196.239,199.02H1.134l158.102,113.324L98.53,496.487l157.604-114.232 157.585,114.232-60.687-184.143L511.134,199.02H316.01z M335.084,318.257l42.407,128.63L267.22,366.963l-11.086-8.033-11.086,8.033-110.291,79.923l42.408-128.63 4.353-13.18-11.289-8.08L59.903,217.909h136.336 13.724l4.242-13.051 41.929-128.957 41.91,128.957 4.242,13.051h13.724 136.336l-110.327,79.088-11.27,8.08z' />
        </svg>
      </div>
      <div class='title'>I'm the host app</div>
      <HostCounter />
    </div>
  </div>

{{#let (load (loadRemote)) as |remote|}}
  {{#if remote.isResolved}}
    <div {{mount remote.value.default}}></div>
  {{else if remote.isPending}}
    Loading...
  {{else if remote.isRejected}}
    Oups, something went wrong.
  {{/if}}
{{/let}}
</template>
