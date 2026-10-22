import { on } from '@ember/modifier'
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'

export default class HostCounter extends Component {
  @tracked count = 0

  increment = () => this.count++

  <template>
    <button type='button' {{on 'click' this.increment}}>
      Host counter: {{this.count}}
    </button>
  </template>
}