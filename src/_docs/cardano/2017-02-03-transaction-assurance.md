---
layout: default
title: Transaction Assurance Level
permalink: /cardano/transaction-assurance/
group: cardano
language: en
---
<!-- Reviewed at a6a1cdf72c7e167a13f500c0679c01fe4cfa0ca8 -->

<style>
.full-width {
    width: 100%;
}

.r {
    color: white;
    background-color: #ef4e4e;
    text-align: right;
    font-weight: 400;
}

.y {
    color: white;
    background-color: #c09e0f;
    text-align: right;
    font-weight: 400;
}

.g {
    color: white;
    background-color: green;
    text-align: right;
    font-weight: 400;
}

.gr {
    color: white;
    background-color: #aaa;
    font-weight: 700;
}

.rd {
    background-color: #fca8a8;
    text-align: right;
    font-weight: 700;
}

.yd {
    background-color: #eccd4a;
    text-align: right;
    font-weight: 700;
}

.gd {
    background-color: #53d153;
    text-align: right;
    font-weight: 700;
}

.center {
    text-align: center;
}

.pct25 {
    width: 25%;
}
</style>
# Transaction Assurance Level

Tables below show color-coded levels of assurance that a transaction won’t be
canceled by some fork.

For example, at normal security level, if the attacker’s stake is **10%** (or $6
millions for Cardano market capitalization of $60 millions), the levels of
assurance for a user’s transaction are:

1.  Lowest assurance (color-coded with red) — when the user’s block with coin
    transfer transaction has depth less than **3** blocks.
2.  Medium assurance (color-coded with yellow) — when the user’s block has depth
    from **3** to **7** blocks.
3.  High assurance (color-coded with green) — when the user’s block has depth
    **9** or more blocks.

## Normal Security Level

Normal level is for covert adversaries (the model is described in the latest
version of Ouroboros being prepared now to be shared). Values in the table
correspond to Cardano market capitalization of $60 millions.

<table class="full-width">
<tr>
    <th class="center">             Attackers' stake, %</th>
    <th class="center pct25">       Attackers’ stake, $ mln </th> 
    <th colspan="6" class="center"> Assurance level         </th>

</tr>
<tr class="center">
    <td></td>
    <td></td>
    <td> Low    </td>
    <td> 0.950  </td>
    <td> 0.990  </td>
    <td> 0.995  </td>
    <td> 0.999  </td>
    <td> High   </td>

</tr>
<tr>
    <td class="gr"> 10          </td>
    <td class="gr"> 6           </td>
    <td class="rd"> &lt; 3      </td>
    <td class="yd"> 3           </td>
    <td class="yd"> 5           </td>
    <td class="yd"> 7           </td>
    <td class="gd"> 9           </td>
    <td class="gd"> 9 &lt;      </td>

</tr>
<tr>
    <td>            15          </td>
    <td>            9           </td>
    <td class="r">  &lt; 5      </td>
    <td class="y">  5           </td>
    <td class="y">  9           </td>
    <td class="y">  11          </td>
    <td class="g">  15          </td>
    <td class="g">  15 &lt;     </td>

</tr>
<tr>
    <td>            20          </td>
    <td>            12          </td>
    <td class="r">  &lt; 7      </td>
    <td class="y">  7           </td>
    <td class="y">  13          </td>
    <td class="y">  15          </td>
    <td class="g">  21          </td>
    <td class="g">  21 &lt;     </td>

</tr>
<tr>
    <td>            25          </td>
    <td>            15          </td>
    <td class="r">  &lt; 9      </td>
    <td class="y">  9           </td>
    <td class="y">  19          </td>
    <td class="y">  23          </td>
    <td class="g">  33          </td>
    <td class="g">  33 &lt;     </td>

</tr>
<tr>
    <td>            30          </td>
    <td>            18          </td>
    <td class="r">  &lt; 17     </td>
    <td class="y">  17          </td>
    <td class="y">  31          </td>
    <td class="y">  39          </td>
    <td class="g">  55          </td>
    <td class="g">  55 &lt;     </td>

</tr>
<tr>
    <td>            35          </td>
    <td>            21          </td>
    <td class="r">  &lt; 29     </td>
    <td class="y">  29          </td>
    <td class="y">  57          </td>
    <td class="y">  71          </td>
    <td class="g">  101         </td>
    <td class="g">  101 &lt;    </td>

</tr>
<tr>
    <td>            40          </td>
    <td>            24          </td>
    <td class="r">  &lt; 67     </td>
    <td class="y">  67          </td>
    <td class="y">  133         </td>
    <td class="y">  163         </td>
    <td class="g">  235         </td>
    <td class="g">  235 &lt;    </td>

</tr>
<tr>
    <td>            45          </td>
    <td>            27          </td>
    <td class="r">  &lt; 269    </td>
    <td class="y">  269         </td>
    <td class="y">  539         </td>
    <td class="y">  661         </td>
    <td class="g">  951         </td>
    <td class="g">  951 &lt;    </td>

</tr>
<tr>
    <td>            46          </td>
    <td>            27.6        </td>
    <td class="r">  &lt; 421    </td>
    <td class="y">  421         </td>
    <td class="y">  843         </td>
    <td class="y">  1033        </td>
    <td class="g">  1487        </td>
    <td class="g">  1487 &lt;   </td>

</tr>
<tr>
    <td>            47          </td>
    <td>            28.2        </td>
    <td class="r">  &lt; 751    </td>
    <td class="y">  751         </td>
    <td class="y">  1501        </td>
    <td class="y">  1841        </td>
    <td class="g">  2649        </td>
    <td class="g">  2649 &lt;   </td>

</tr>
<tr>
    <td>            48          </td>
    <td>            28.8        </td>
    <td class="r">  &lt; 1691   </td>
    <td class="y">  1691        </td>
    <td class="y">  3381        </td>
    <td class="y">  4143        </td>
    <td class="g">  5965        </td>
    <td class="g">  5965 &lt;   </td>

</tr>
<tr>
    <td>            49          </td>
    <td>            29.4        </td>
    <td class="r">  &lt; 6763   </td>
    <td class="y">  6763        </td>
    <td class="y">  13527       </td>
    <td class="y">  16585       </td>
    <td class="g">  23869       </td>
    <td class="g">  23869 &lt;  </td>

</tr>
</table>
## Strict Security Level

Strict security level protects against all types of adversaries (it requires
more block confirmations). Values in the table correspond to Cardano market
capitalization of $60 millions.

<table class="full-width">
<tr>
    <th class="center">             Attackers' stake, %</th>
    <th class="center pct25">       Attackers’ stake, $ mln </th> 
    <th colspan="6" class="center"> Assurance level         </th>

</tr>
<tr class="center">
    <td></td>
    <td></td>
    <td> Low    </td>
    <td> 0.950  </td>
    <td> 0.990  </td>
    <td> 0.995  </td>
    <td> 0.999  </td>
    <td> High   </td>

</tr>
<tr>
    <td class="gr"> 10          </td>
    <td class="gr"> 6           </td>
    <td class="rd"> &lt; 5      </td>
    <td class="yd"> 5           </td>
    <td class="yd"> 9           </td>
    <td class="yd"> 11          </td>
    <td class="gd"> 15          </td>
    <td class="gd"> 15 &lt;     </td>

</tr>
<tr>
    <td>            15          </td>
    <td>            9           </td>
    <td class="r">  &lt; 7      </td>
    <td class="y">  7           </td>
    <td class="y">  14          </td>
    <td class="y">  16          </td>
    <td class="g">  23          </td>
    <td class="g">  23 &lt;     </td>

</tr>
<tr>
    <td>            20          </td>
    <td>            12          </td>
    <td class="r">  &lt; 12     </td>
    <td class="y">  12          </td>
    <td class="y">  21          </td>
    <td class="y">  25          </td>
    <td class="g">  35          </td>
    <td class="g">  35 &lt;     </td>

</tr>
<tr>
    <td>            25          </td>
    <td>            15          </td>
    <td class="r">  &lt; 19     </td>
    <td class="y">  19          </td>
    <td class="y">  34          </td>
    <td class="y">  40          </td>
    <td class="g">  55          </td>
    <td class="g">  55 &lt;     </td>

</tr>
<tr>
    <td>            30          </td>
    <td>            18          </td>
    <td class="r">  &lt; 32     </td>
    <td class="y">  32          </td>
    <td class="y">  57          </td>
    <td class="y">  68          </td>
    <td class="g">  94          </td>
    <td class="g">  94 &lt;     </td>

</tr>
<tr>
    <td>            35          </td>
    <td>            21          </td>
    <td class="r">  &lt; 63     </td>
    <td class="y">  63          </td>
    <td class="y">  111         </td>
    <td class="y">  132         </td>
    <td class="g">  181         </td>
    <td class="g">  181 &lt;    </td>

</tr>
<tr>
    <td>            40          </td>
    <td>            24          </td>
    <td class="r">  &lt; 157    </td>
    <td class="y">  157         </td>
    <td class="y">  274         </td>
    <td class="y">  325         </td>
    <td class="g">  443         </td>
    <td class="g">  443 &lt;    </td>

</tr>
<tr>
    <td>            45          </td>
    <td>            27          </td>
    <td class="r">  &lt; 729    </td>
    <td class="y">  729         </td>
    <td class="y">  1246         </td>
    <td class="y">  1470         </td>
    <td class="g">  1990         </td>
    <td class="g">  1990 &lt;    </td>

</tr>
<tr>
    <td>            46          </td>
    <td>            27.6        </td>
    <td class="r">  &lt; 1190   </td>
    <td class="y">  1190        </td>
    <td class="y">  2020        </td>
    <td class="y">  2379        </td>
    <td class="g">  3214        </td>
    <td class="g">  3214 &lt;   </td>

</tr>
<tr>
    <td>            47          </td>
    <td>            28.2        </td>
    <td class="r">  &lt; 2230   </td>
    <td class="y">  2230        </td>
    <td class="y">  3758        </td>
    <td class="y">  4418        </td>
    <td class="g">  5953        </td>
    <td class="g">  5953 &lt;   </td>

</tr>
<tr>
    <td>            48          </td>
    <td>            28.8        </td>
    <td class="r">  &lt; 5382   </td>
    <td class="y">  5382        </td>
    <td class="y">  8986        </td>
    <td class="y">  10542       </td>
    <td class="g">  14157       </td>
    <td class="g">  14157 &lt;  </td>

</tr>
<tr>
    <td>            49          </td>
    <td>            29.4        </td>
    <td class="r">  &lt; 24029  </td>
    <td class="y">  24029       </td>
    <td class="y">  39603       </td>
    <td class="y">  46320       </td>
    <td class="g">  61922       </td>
    <td class="g">  61922 &lt;  </td>

</tr>
</table>

