import { on } from '@ember/modifier'
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'

export default class RemoteCounter extends Component {
  @tracked count = 0

  increment = () => this.count++

  <template>
    <button type='button' {{on 'click' this.increment}}>
      Remote counter: {{this.count}}
    </button>
  </template>
}
